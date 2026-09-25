import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { TelegramAccount, TelegramLinkCode, User } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { TelegramIdentityService } from '../telegram-identity.service';

import { AppBadRequestException, AppConflictException } from '../../../../common/exceptions';
import { AUTH_PROVIDER, placeholderEmail } from '../../../../lib/auth';
import { TelegramLinkService } from '../telegram-link.service';

const identity = { telegramId: 42n, username: 'ivan', name: 'ivan', languageCode: 'ru' };

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();
  const identities = mock<TelegramIdentityService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.telegramLinkCode.findUniqueOrThrow.mockResolvedValue(mock<TelegramLinkCode>({ userId: 'site-user' }));
  prisma.notificationSettings.findUnique.mockResolvedValue(null);
  config.get.mockReturnValue('bronevik_bot');

  return { service: new TelegramLinkService(prisma, config, identities), prisma, identities };
};

const disposable = (id: string) => ({
  ...mock<User>({ id, email: placeholderEmail({ provider: AUTH_PROVIDER.telegram, id: 42 }) }),
  _count: { lestaAccounts: 0, subscriptions: 0, payments: 0 }
});

describe('TelegramLinkService.consumeCode', () => {
  it('refuses an unknown, used or expired code', async () => {
    const { service, prisma } = createService();

    prisma.telegramLinkCode.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.telegramAccount.upsert).not.toHaveBeenCalled();
  });

  it('links the chat to the code owner and switches telegram notifications on', async () => {
    const { service, prisma } = createService();

    prisma.telegramLinkCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(null);

    expect(await service.consumeCode({ code: 'abcd efgh', identity })).toBe('site-user');

    expect(prisma.telegramLinkCode.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ code: 'ABCDEFGH' }) })
    );

    expect(prisma.telegramAccount.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { telegramId: 42n } }));

    expect(prisma.notificationSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ channels: expect.arrayContaining(['telegram']) }) })
    );
  });

  it('refuses to steal a chat that belongs to a real account', async () => {
    const { service, prisma } = createService();

    prisma.telegramLinkCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'other-user' }));
    prisma.user.findUnique.mockResolvedValue({ ...disposable('other-user'), email: 'real@example.com' });

    await expect(service.consumeCode({ code: 'ABCDEFGH', identity })).rejects.toBeInstanceOf(AppConflictException);
  });

  it('absorbs an empty account the bot created for the same chat', async () => {
    const { service, prisma } = createService();

    prisma.telegramLinkCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.telegramAccount.findUnique.mockResolvedValue(mock<TelegramAccount>({ userId: 'bot-user' }));
    prisma.user.findUnique.mockResolvedValue(disposable('bot-user'));

    await service.consumeCode({ code: 'ABCDEFGH', identity });

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'bot-user' } });
  });
});

describe('TelegramLinkService.redeemWebLogin', () => {
  it('issues a session only for a fresh one-time code', async () => {
    const { service, prisma, identities } = createService();

    prisma.telegramWebLogin.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    prisma.telegramWebLogin.findUniqueOrThrow.mockResolvedValue({
      code: 'c',
      userId: 'u1',
      expiresAt: new Date(),
      usedAt: null,
      createdAt: new Date()
    });

    identities.issueSessionToken.mockResolvedValue('session-token');

    expect(await service.redeemWebLogin('c')).toBe('session-token');
    await expect(service.redeemWebLogin('c')).rejects.toBeInstanceOf(AppBadRequestException);
  });
});
