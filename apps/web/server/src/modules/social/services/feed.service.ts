import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { FeedInput, FeedItem } from '../social.types';

import { PrismaService } from '../../../core';
import { FEED } from '../config';
import { buildFeed } from '../lib';
import { toFeedBadge } from '../mappers';
import { FollowService } from './follow.service';
import { SnapshotEventsService } from './snapshot-events.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly follows: FollowService,
    private readonly events: SnapshotEventsService
  ) {}

  async feed({ userId, days = FEED.days }: FeedInput): Promise<{ items: FeedItem[] }> {
    const { accountIds } = await this.follows.circle(userId);
    const until = new Date();
    const since = subDays(until, days);
    const [snapshots, records, badges, players] = await Promise.all([
      this.events.tankEvents({ accountIds, since, until }),
      this.events.recordEvents({ accountIds, since, until }),
      this.prisma.accountBadge.findMany({
        where: { accountId: { in: accountIds }, awardedAt: { gte: since } },
        select: { accountId: true, badgeCode: true, awardedAt: true }
      }),
      this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, select: { accountId: true, nickname: true } })
    ]);

    return {
      items: buildFeed({
        snapshots,
        records,
        badges,
        nicknames: new Map(players.map((player) => [player.accountId, player.nickname])),
        aceMastery: FEED.aceMastery,
        limit: FEED.limit,
        badgeOf: toFeedBadge
      })
    };
  }
}
