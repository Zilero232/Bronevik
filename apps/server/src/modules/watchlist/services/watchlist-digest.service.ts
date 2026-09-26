import { Injectable } from '@nestjs/common';
import { isPlusDigest, WATCHLIST } from '@otmetki/schemas';

import type { DigestForInput } from '../watchlist.types';

import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { NotificationService } from '../../notifications';
import { WATCHLIST_DIGEST_RUN } from '../config';
import { digestWindowStart, isDigestDue, summarizeDigest } from '../lib/watchlist-digest';
import { WatchlistActivityService } from './watchlist-activity.service';

@Injectable()
export class WatchlistDigestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
    private readonly notifications: NotificationService,
    private readonly activity: WatchlistActivityService
  ) {}

  async run(now = new Date()): Promise<number> {
    let cursor: string | undefined;
    let sent = 0;

    for (;;) {
      const page = await this.prisma.watchlistSettings.findMany({
        where: { digest: { not: 'off' }, ...(cursor ? { userId: { gt: cursor } } : {}) },
        orderBy: { userId: 'asc' },
        take: WATCHLIST_DIGEST_RUN.batchSize
      });

      for (const settings of page) {
        sent += await this.digestFor({ settings, now });
      }

      cursor = page.at(-1)?.userId;

      if (page.length < WATCHLIST_DIGEST_RUN.batchSize) {
        return sent;
      }
    }
  }

  private async digestFor({ settings, now }: DigestForInput): Promise<number> {
    const digest = isPlusDigest(settings.digest) && !(await this.entitlements.isPlus(settings.userId)) ? WATCHLIST.defaultDigest : settings.digest;

    if (!isDigestDue({ digest, lastDigestAt: settings.lastDigestAt, now })) {
      return 0;
    }

    const since = digestWindowStart({ digest, lastDigestAt: settings.lastDigestAt, now });
    const follows = await this.prisma.follow.findMany({ where: { userId: settings.userId, kind: 'player' }, select: { targetId: true } });
    const accountIds = follows.map((follow) => follow.targetId);

    const [activity, players] = await Promise.all([
      this.activity.activity({ accountIds, since }),
      this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, select: { accountId: true, nickname: true } })
    ]);

    const nicknameOf = new Map(players.map((player) => [player.accountId, player.nickname]));

    const summary = summarizeDigest({
      players: accountIds.map((accountId) => {
        const stats = activity.get(accountId);

        return {
          nickname: nicknameOf.get(accountId) ?? String(accountId),
          battles: stats?.battles ?? 0,
          wins: stats?.wins ?? 0,
          marksGained: stats?.marksGained ?? 0
        };
      }),
      limit: WATCHLIST.digestTopPlayers
    });

    await this.prisma.watchlistSettings.update({ where: { userId: settings.userId }, data: { lastDigestAt: now } });

    if (!summary) {
      return 0;
    }

    await this.notifications.notify({
      userId: settings.userId,
      notification: { event: 'watchlistDigest', ...summary },
      dedupeKey: `${WATCHLIST_DIGEST_RUN.dedupePrefix}-${now.toISOString().slice(0, 13)}`
    });

    return 1;
  }
}
