import { Injectable } from '@nestjs/common';

import type { FindLinkedInput, LinkedBotUser } from '../bot-commands.types';

import { PrismaService } from '../../../core';
import { resolveBotLocale } from '../lib';

@Injectable()
export class BotAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async find({ providerId, externalId, languageHint }: FindLinkedInput): Promise<LinkedBotUser | null> {
    const account = await this.prisma.account.findUnique({
      where: { providerId_accountId: { providerId, accountId: externalId } },
      select: {
        userId: true,
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
      accountId: primary?.accountId ?? null,
      nickname: primary?.player.nickname ?? null,
      locale: resolveBotLocale(account.user.locale || languageHint)
    };
  }
}
