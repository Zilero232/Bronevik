import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { OneTimeCode, TelegramAccount, User } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { CommunityContentService } from '../../../community-core';
import type { TelegramIdentityService } from '../telegram-identity.service';

import { AppBadRequestException, AppConflictException } from '../../../../common/exceptions';
import { AUTH_PROVIDER, placeholderEmail } from '../../../../lib/auth';
import { DISPOSABLE_USER_COUNTS } from '../../config';
import { TelegramLinkService } from '../telegram-link.service';

const identity = { telegramId: 42n, username: 'ivan', name: 'ivan', languageCode: 'ru' };

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();
  const identities = mock<TelegramIdentityService>();
  const communityContent = mock<CommunityContentService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.oneTimeCode.findUniqueOrThrow.mockResolvedValue(mock<OneTimeCode>({ userId: 'site-user' }));
  prisma.notificationSettings.findUnique.mockResolvedValue(null);
  config.get.mockReturnValue('otmetki_bot');

  return { service: new TelegramLinkService(prisma, config, identities, communityContent), prisma, identities, communityContent };
};

const emptyCounts = Object.fromEntries(Object.keys(DISPOSABLE_USER_COUNTS).map((relation) => [relation, 0]));

type HeldData = {
  accounts: { id: string }[];
  streamerProfile: { id: string } | null;
  settingsShare: { userId: string } | null;
  coachProfile: { userId: string } | null;
  referredBy: { referredUserId: string } | null;
  _count: Record<string, number>;
};

const NOTHING_HELD: HeldData = {
  accounts: [],
  streamerProfile: null,
  settingsShare: null,
  coachProfile: null,
  referredBy: null,
  _count: emptyCounts
};

const disposable = (id: string) => ({
  ...mock<User>({ id, email: placeholderEmail({ provider: AUTH_PROVIDER.telegram, id: 42 }) }),
  ...NOTHING_HELD
});

const holding = (overrides: Partial<HeldData>) => ({ ...disposable('bot-user'), ...overrides });

describe('TelegramLinkService.consumeCode', () => {
  it('refuses an unknown, used or expired code', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.telegramAccount.upsert).not.toHaveBeenCalled();
  });

  it('links the chat to the code owner and switches telegram notifications on', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(null);

    expect(await service.consumeCode({ code: 'abcd efgh', identity })).toBe('site-user');

    expect(prisma.oneTimeCode.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ code: 'ABCDEFGH', purpose: 'telegramLink', usedAt: null }) })
    );

    expect(prisma.telegramAccount.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { telegramId: 42n } }));

    expect(prisma.notificationSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ channels: expect.arrayContaining(['telegram']) }) })
    );
  });

  it('refuses to steal a chat that belongs to a real account', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'other-user' }));
    prisma.user.findUnique.mockResolvedValue({ ...disposable('other-user'), email: 'real@example.com' });

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppConflictException);
  });

  it('absorbs an empty account the bot created for the same chat', async () => {
    const { service, prisma, communityContent } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'bot-user' }));
    prisma.user.findUnique.mockResolvedValue(disposable('bot-user'));

    await service.consumeCode({ code: 'ABCDEFGH', identity });

    expect(communityContent.purgeAuthoredBy).toHaveBeenCalledWith({ userId: 'bot-user', db: prisma });
    expect(prisma.user.delete).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'bot-user' } }));
  });
});

describe('TelegramLinkService.consumeCode with a placeholder account that holds data', () => {
  it.each(Object.keys(DISPOSABLE_USER_COUNTS))('refuses to delete an account that has %s', async (relation) => {
    const { service, prisma, communityContent } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'bot-user' }));
    prisma.user.findUnique.mockResolvedValue(holding({ _count: { ...emptyCounts, [relation]: 1 } }));

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppConflictException);
    expect(communityContent.purgeAuthoredBy).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('refuses to delete an account that signs in another way', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'bot-user' }));
    prisma.user.findUnique.mockResolvedValue(holding({ accounts: [{ id: 'vk-account' }] }));

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppConflictException);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('refuses to delete an account that owns a streamer page', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'bot-user' }));
    prisma.user.findUnique.mockResolvedValue(holding({ streamerProfile: { id: 'p1' } }));

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppConflictException);
  });
});

describe('TelegramLinkService.previewCode', () => {
  it('names the account a fresh code would link to', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.findFirst.mockResolvedValue(mock<OneTimeCode & { user: User }>({ user: { name: 'Owner' } }));

    expect(await service.previewCode('abcd efgh')).toEqual({ code: 'ABCDEFGH', accountName: 'Owner' });

    expect(prisma.oneTimeCode.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ code: 'ABCDEFGH', purpose: 'telegramLink', usedAt: null }) })
    );
  });

  it('returns null for an unknown, used or expired code without consuming it', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.findFirst.mockResolvedValue(null);

    expect(await service.previewCode('ABCDEFGH')).toBeNull();
    expect(prisma.oneTimeCode.updateMany).not.toHaveBeenCalled();
  });
});

describe('TelegramLinkService.redeemWebLogin', () => {
  it('issues a session only for a fresh one-time code', async () => {
    const { service, prisma, identities } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    prisma.oneTimeCode.findUniqueOrThrow.mockResolvedValue({
      code: 'c',
      purpose: 'telegramWebLogin',
      userId: 'u1',
      accountId: null,
      deviceId: null,
      expiresAt: new Date(),
      usedAt: null,
      createdAt: new Date()
    });

    identities.issueSessionToken.mockResolvedValue('session-token');

    expect(await service.redeemWebLogin('c')).toBe('session-token');
    await expect(service.redeemWebLogin('c')).rejects.toBeInstanceOf(AppBadRequestException);

    expect(prisma.oneTimeCode.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ code: 'c', purpose: 'telegramWebLogin', usedAt: null }) })
    );
  });

  it('never redeems a link code as a web login', async () => {
    const { service, prisma } = createService();

    prisma.oneTimeCode.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.redeemWebLogin('ABCDEFGH')).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.oneTimeCode.findUniqueOrThrow).not.toHaveBeenCalled();
  });
});

describe('TelegramLinkService.issueCode', () => {
  it('replaces only the previous link codes of the user', async () => {
    const { service, prisma } = createService();

    await service.issueCode('u1');

    expect(prisma.oneTimeCode.deleteMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'u1', purpose: 'telegramLink' } }));

    expect(prisma.oneTimeCode.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ purpose: 'telegramLink', userId: 'u1' }) })
    );
  });
});
