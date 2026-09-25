import { Injectable } from '@nestjs/common';

import type { LeagueStats } from '../lib';
import type { LeagueInput, LeagueView } from '../social.types';

import { toIsoDate, weekWindow } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { LEAGUE } from '../config';
import { rankLeague } from '../lib';
import { FollowService } from './follow.service';
import { SnapshotEventsService } from './snapshot-events.service';

@Injectable()
export class LeagueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly follows: FollowService,
    private readonly events: SnapshotEventsService
  ) {}

  async league({ userId, metric, week }: LeagueInput): Promise<LeagueView> {
    const { accountIds, own } = await this.follows.circle(userId);
    const { start, end } = weekWindow(week ? new Date(`${week}T00:00:00Z`) : new Date());
    const [sessions, marks, players] = await Promise.all([
      this.prisma.playSession.findMany({
        where: { accountId: { in: accountIds }, source: 'api', kind: 'day', startedAt: { gte: start, lt: end } },
        select: { accountId: true, battles: true, damageDealt: true, wn8: true }
      }),
      metric === 'marks' ? this.events.markCounts({ accountIds, since: start, until: end }) : new Map<bigint, number>(),
      this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, select: { accountId: true, nickname: true } })
    ]);

    const stats = new Map<bigint, LeagueStats>(
      accountIds.map((accountId) => [
        accountId,
        { accountId, battles: 0, damage: 0, wn8Weighted: 0, wn8Battles: 0, marks: marks.get(accountId) ?? 0 }
      ])
    );

    for (const session of sessions) {
      const entry = stats.get(session.accountId);

      if (!entry) {
        continue;
      }

      entry.battles += session.battles;
      entry.damage += session.damageDealt;

      if (session.wn8 !== null) {
        entry.wn8Weighted += session.wn8 * session.battles;
        entry.wn8Battles += session.battles;
      }
    }

    const nicknames = new Map(players.map((player) => [player.accountId, player.nickname]));

    return {
      metric,
      weekStart: toIsoDate(start) ?? '',
      entries: rankLeague({ stats: [...stats.values()], metric, minBattles: LEAGUE.minBattles }).map((entry) => ({
        rank: entry.rank,
        accountId: Number(entry.accountId),
        nickname: nicknames.get(entry.accountId) ?? null,
        isMe: own.has(entry.accountId),
        battles: entry.battles,
        value: entry.value
      }))
    };
  }
}
