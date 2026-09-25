import { Injectable } from '@nestjs/common';

import type { LinkedChat, TelegramIdentity } from '../telegram.types';

import { PrismaService } from '../../../core';
import { resolveBotLocale } from '../lib';

@Injectable()
export class TelegramChatService {
  constructor(private readonly prisma: PrismaService) {}

  async find(telegramId: bigint): Promise<LinkedChat | null> {
    const account = await this.prisma.telegramAccount.findUnique({
      where: { telegramId },
      select: {
        userId: true,
        languageCode: true,
        user: {
          select: {
            locale: true,
            lestaAccounts: {
              orderBy: [{ isPrimary: 'desc' }, { linkedAt: 'asc' }],
              take: 1,
              select: { accountId: true, player: { select: { nickname: true } } }
            }
          }
        }
      }
    });

    if (!account) {
      return null;
    }

    const [primary] = account.user.lestaAccounts;

    return {
      userId: account.userId,
      telegramId,
      accountId: primary?.accountId ?? null,
      nickname: primary?.player.nickname ?? null,
      locale: resolveBotLocale(account.user.locale || account.languageCode)
    };
  }

  async touch({ telegramId, username, languageCode }: TelegramIdentity): Promise<void> {
    await this.prisma.telegramAccount.updateMany({ where: { telegramId }, data: { lastSeenAt: new Date(), username, languageCode } });
  }
}
