import { Injectable, Logger } from '@nestjs/common';
import { groupBy, sumBy, unique } from 'remeda';

import type { WeekStats } from '../lib';
import type { ChallengeBattleRow } from '../queries';
import type { ChallengesView, RecordChallengeInput, WeekStatsInput } from '../social.types';

import { toIsoDate, toJsonValue, weekWindow } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { NotificationService } from '../../notifications';
import { CHALLENGE_BADGES, WEEKLY_CHALLENGES } from '../config';
import { badgeCodeOf, challengeProgress, isChallengeBadgeCode } from '../lib';
import { toWeeklyChallengeView } from '../mappers';
import { challengeBattlesSql } from '../queries';
import { SnapshotEventsService } from './snapshot-events.service';

@Injectable()
export class WeeklyChallengeService {
  private readonly logger = new Logger(WeeklyChallengeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: SnapshotEventsService,
    private readonly notifications: NotificationService
  ) {}

  async forUser(userId: string): Promise<ChallengesView> {
    const { weekStart, end } = weekWindow(new Date());
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });
    const progress = await this.prisma.weeklyChallengeProgress.findMany({
      where: { weekStart, accountId: { in: links.map((link) => link.accountId) } }
    });

    return {
      weekStart: toIsoDate(weekStart) ?? '',
      endsAt: end.toISOString(),
      challenges: WEEKLY_CHALLENGES.map((definition) => toWeeklyChallengeView({ definition, progress }))
    };
  }

  async evaluate(now: Date): Promise<number> {
    const { start, end, weekStart } = weekWindow(now);
    let cursor: bigint | null = null;
    let accounts = 0;
    let completed = 0;

    for (;;) {
      const links = await this.prisma.userLestaAccount.findMany({
        where: cursor === null ? {} : { accountId: { gt: cursor } },
        select: { accountId: true },
        distinct: ['accountId'],
        orderBy: { accountId: 'asc' },
        take: CHALLENGE_BADGES.accountsPerPage
      });

      const accountIds: bigint[] = links.map((link) => link.accountId);
      const stats = accountIds.length === 0 ? new Map<bigint, WeekStats>() : await this.weekStats({ accountIds, start, end });

      for (const [accountId, own] of stats) {
        for (const definition of WEEKLY_CHALLENGES) {
          completed += (await this.record({ accountId, weekStart, definition, stats: own, now })) ? 1 : 0;
        }
      }

      accounts += accountIds.length;
      cursor = accountIds.at(-1) ?? cursor;

      if (accountIds.length < CHALLENGE_BADGES.accountsPerPage) {
        break;
      }
    }

    this.logger.log(`weekly challenges: ${accounts} accounts, ${completed} completed`);

    return completed;
  }

  private async record({ accountId, weekStart, definition, stats, now }: RecordChallengeInput): Promise<boolean> {
    const value = challengeProgress({ definition, stats });
    const key = { accountId_weekStart_code: { accountId, weekStart, code: definition.code } };
    const existing = await this.prisma.weeklyChallengeProgress.findUnique({ where: key });
    const justCompleted = value >= definition.target && !existing?.completedAt;

    await this.prisma.weeklyChallengeProgress.upsert({
      where: key,
      create: { accountId, weekStart, code: definition.code, progress: value, target: definition.target, completedAt: justCompleted ? now : null },
      update: { progress: value, target: definition.target, ...(justCompleted ? { completedAt: now } : {}) }
    });

    if (!justCompleted) {
      return false;
    }

    const badgeCode = badgeCodeOf(definition);

    if (!isChallengeBadgeCode(badgeCode)) {
      throw new Error(`Unknown challenge badge ${badgeCode}`);
    }

    const badge = await this.prisma.accountBadge.findUnique({ where: { accountId_badgeCode: { accountId, badgeCode } } });
    const times =
      (typeof badge?.context === 'object' && badge.context && !Array.isArray(badge.context) && typeof badge.context.times === 'number'
        ? badge.context.times
        : 0) + 1;

    await this.prisma.accountBadge.upsert({
      where: { accountId_badgeCode: { accountId, badgeCode } },
      create: { accountId, badgeCode, context: toJsonValue({ times, lastWeek: toIsoDate(weekStart) }) },
      update: { context: toJsonValue({ times, lastWeek: toIsoDate(weekStart) }) }
    });

    if (!badge) {
      await this.notifications.notifyAccount({
        accountId,
        dedupeKey: `badge-${accountId}-${badgeCode}`,
        notification: { event: 'badgeAwarded', accountId: Number(accountId), badgeCode, title: definition.code }
      });
    }

    return true;
  }

  private async weekStats({ accountIds, start, end }: WeekStatsInput): Promise<Map<bigint, WeekStats>> {
    const [sessions, battles, deltas, marks] = await Promise.all([
      this.prisma.playSession.findMany({
        where: { accountId: { in: accountIds }, source: 'api', kind: 'day', startedAt: { gte: start, lt: end } },
        select: { accountId: true, battles: true, wins: true, spotted: true }
      }),
      this.prisma.$queryRaw<ChallengeBattleRow[]>(challengeBattlesSql({ accountIds, start, end })),
      this.prisma.tankBattleDelta.findMany({
        where: { accountId: { in: accountIds }, mode: 'random', battles: 1, capturedAt: { gte: start, lt: end } },
        select: { accountId: true, tankId: true, damageDealt: true }
      }),
      this.events.markCounts({ accountIds, since: start, until: end })
    ]);

    const vehicles = await this.prisma.vehicle.findMany({
      where: { tankId: { in: unique([...battles, ...deltas].map((row) => row.tankId)) } },
      select: { tankId: true, type: true }
    });

    const typeOf = new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle.type]));
    const byAccount = <T extends { accountId: bigint }>(rows: T[]) => groupBy(rows, (row) => String(row.accountId));
    const sessionsOf = byAccount(sessions);
    const modOf = byAccount(battles);
    const apiOf = byAccount(deltas);

    return new Map(
      accountIds.map((accountId): [bigint, WeekStats] => {
        const key = String(accountId);
        const own = sessionsOf[key] ?? [];
        const fromMod = modOf[key] ?? [];
        const fromApi = apiOf[key] ?? [];
        const source = fromMod.length >= fromApi.length ? fromMod : fromApi;

        return [
          accountId,
          {
            battles: sumBy(own, (row) => row.battles),
            wins: sumBy(own, (row) => row.wins),
            spotted: sumBy(own, (row) => row.spotted),
            marks: marks.get(accountId) ?? 0,
            bigDamage: source.map((row) => ({ damage: row.damageDealt, vehicleType: typeOf.get(row.tankId) ?? null }))
          }
        ];
      })
    );
  }
}
