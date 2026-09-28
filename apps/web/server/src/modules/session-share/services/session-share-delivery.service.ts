import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { SessionSharePayload } from '../config';

import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { DiscordSenderService } from '../../discord';
import { renderNotification, resolveNotificationLocale } from '../../notifications';
import { TelegramSenderService } from '../../telegram';
import { toSessionCard } from '../mappers';
import { SESSION_CARD_SELECT, SHARE_RECIPIENT_SELECT } from '../selects';

@Injectable()
export class SessionShareDeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly telegram: TelegramSenderService,
    private readonly discord: DiscordSenderService
  ) {}

  async deliver({ userId, sessionId, channel }: SessionSharePayload): Promise<boolean> {
    const [recipient, session] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: SHARE_RECIPIENT_SELECT }),
      this.prisma.playSession.findUnique({ where: { id: sessionId }, select: SESSION_CARD_SELECT })
    ]);

    const card = session ? toSessionCard(session) : null;

    if (!recipient || !session || !card) {
      return false;
    }

    const owns = await this.prisma.userLestaAccount.count({ where: { userId, accountId: session.accountId } });

    if (owns === 0) {
      return false;
    }

    const locale = resolveNotificationLocale(recipient.locale);
    const rendered = renderNotification({ notification: card, locale, webUrl: this.config.get('WEB_URL') });
    const telegramId = recipient.telegramAccount?.telegramId ?? null;
    const discordUserId = recipient.accounts[0]?.accountId ?? null;

    return match(channel)
      .with('telegram', async () => {
        if (telegramId === null || !this.telegram.isEnabled) {
          return false;
        }

        await this.telegram.sendNotification({ telegramId, locale, ...rendered });

        return true;
      })
      .with('discord', async () => {
        if (discordUserId === null || !this.discord.isEnabled) {
          return false;
        }

        await this.discord.sendDirect({ discordUserId, ...rendered });

        return true;
      })
      .exhaustive();
  }
}
