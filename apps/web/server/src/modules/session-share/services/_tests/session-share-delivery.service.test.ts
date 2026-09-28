import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PlaySession, User } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { DiscordSenderService } from '../../../discord';
import type { TelegramSenderService } from '../../../telegram';
import type { SessionCardRow, ShareRecipientRow } from '../../selects';

import { SessionShareDeliveryService } from '../session-share-delivery.service';

const SESSION = '3f0a4d5e-6b7c-4d8e-9f0a-1b2c3d4e5f60';

const recipient: ShareRecipientRow = { locale: 'en', telegramAccount: { telegramId: 42n }, accounts: [{ accountId: '998877' }] };

const session: SessionCardRow = {
  id: SESSION,
  accountId: 7n,
  battles: 4,
  wins: 3,
  damageDealt: 8000,
  wn8: 2000,
  player: { nickname: 'Tanker' }
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();
  const telegram = mock<TelegramSenderService>({ isEnabled: true });
  const discord = mock<DiscordSenderService>({ isEnabled: true });

  config.get.mockReturnValue('https://triotmetki.ru');
  prisma.user.findUnique.mockResolvedValue(mock<User & ShareRecipientRow>(recipient));
  prisma.playSession.findUnique.mockResolvedValue(mock<PlaySession>(session));
  prisma.userLestaAccount.count.mockResolvedValue(1);

  return { service: new SessionShareDeliveryService(prisma, config, telegram, discord), prisma, telegram, discord };
};

describe('SessionShareDeliveryService.deliver', () => {
  it('sends the rendered session card to the linked Telegram chat', async () => {
    const { service, telegram, discord } = createService();

    await expect(service.deliver({ userId: 'user', sessionId: SESSION, channel: 'telegram' })).resolves.toBe(true);

    expect(telegram.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({ telegramId: 42n, locale: 'en', url: expect.stringContaining(SESSION) })
    );

    expect(discord.sendDirect).not.toHaveBeenCalled();
  });

  it('sends the card as a direct message to the linked Discord user', async () => {
    const { service, discord } = createService();

    await expect(service.deliver({ userId: 'user', sessionId: SESSION, channel: 'discord' })).resolves.toBe(true);

    expect(discord.sendDirect).toHaveBeenCalledWith(expect.objectContaining({ discordUserId: '998877', title: expect.any(String) }));
  });

  it('sends nothing for a session of an account the user does not own', async () => {
    const { service, prisma, telegram } = createService();

    prisma.userLestaAccount.count.mockResolvedValue(0);

    await expect(service.deliver({ userId: 'user', sessionId: SESSION, channel: 'telegram' })).resolves.toBe(false);
    expect(telegram.sendNotification).not.toHaveBeenCalled();
    expect(prisma.userLestaAccount.count.mock.calls[0]?.[0]?.where).toEqual({ userId: 'user', accountId: session.accountId });
  });

  it('skips a channel that was unlinked after the job was queued', async () => {
    const { service, prisma, discord } = createService();

    prisma.user.findUnique.mockResolvedValue(mock<User & ShareRecipientRow>({ ...recipient, accounts: [] }));

    await expect(service.deliver({ userId: 'user', sessionId: SESSION, channel: 'discord' })).resolves.toBe(false);
    expect(discord.sendDirect).not.toHaveBeenCalled();
  });
});
