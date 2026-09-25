import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { ChatReplyInput, ChatTextInput } from '../streamers.types';

import { PrismaService } from '../../../core';
import { fillTemplate, resolveNotificationLocale } from '../../notifications';
import { CHAT_COPY } from '../config';
import { chatNumber } from '../lib';

@Injectable()
export class StreamerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async chatCopy(streamerUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: streamerUserId }, select: { locale: true } });

    return CHAT_COPY[resolveNotificationLocale(user?.locale)];
  }

  async text({ streamerUserId, pick, values }: ChatTextInput): Promise<string> {
    const copy = await this.chatCopy(streamerUserId);

    return fillTemplate({ template: pick(copy), values });
  }

  async reply({ streamerUserId, command }: ChatReplyInput): Promise<string | null> {
    const profile = await this.prisma.streamerProfile.findUnique({
      where: { userId: streamerUserId },
      select: { accountId: true, displayName: true }
    });

    const accountId = profile?.accountId;

    if (!accountId) {
      return null;
    }

    const [copy, player] = await Promise.all([
      this.chatCopy(streamerUserId),
      this.prisma.player.findUnique({ where: { accountId }, select: { nickname: true } })
    ]);

    const nickname = player?.nickname ?? profile.displayName;
    const missing = copy.missing;

    return match(command)
      .with('stat', async () => {
        const rating = await this.prisma.accountRating.findUnique({ where: { accountId_period: { accountId, period: 'overall' } } });

        return fillTemplate({
          template: copy.stat,
          values: {
            nickname,
            wn8: chatNumber({ value: rating?.wn8, missing }),
            winRate: chatNumber({ value: rating?.winRate, digits: 2, missing }),
            battles: rating?.battles ?? missing
          }
        });
      })
      .with('session', async () => {
        const session = await this.prisma.playSession.findFirst({ where: { accountId, battles: { gt: 0 } }, orderBy: { startedAt: 'desc' } });

        if (!session) {
          return fillTemplate({ template: copy.sessionNone, values: { nickname } });
        }

        return fillTemplate({
          template: copy.session,
          values: {
            nickname,
            battles: session.battles,
            winRate: chatNumber({ value: (session.wins * 100) / session.battles, digits: 1, missing }),
            avgDamage: chatNumber({ value: session.damageDealt / session.battles, missing })
          }
        });
      })
      .with('marks', async () => {
        const groups = await this.prisma.playerTank.groupBy({
          by: ['marksOnGun'],
          where: { accountId, marksOnGun: { gt: 0 } },
          _count: { _all: true }
        });

        const count = (marks: number) => groups.find((group) => group.marksOnGun === marks)?._count._all ?? 0;

        return fillTemplate({ template: copy.marks, values: { nickname, moe3: count(3), moe2: count(2), moe1: count(1) } });
      })
      .exhaustive();
  }
}
