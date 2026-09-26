import { Injectable, Logger } from '@nestjs/common';
import { unique } from 'remeda';

import type { WeekStats } from '../lib';
import type { ChallengesView, RecordChallengeInput, WeekStatsInput } from '../social.types';

import { toIsoDate, toJsonValue, weekWindow } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { NotificationService } from '../../notifications';
import { CHALLENGE_BADGES, WEEKLY_CHALLENGES } from '../config';
import { badgeCodeOf, challengeProgress } from '../lib';
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
    const { start, end } = weekWindow(new Date());
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });
    const progress = await this.prisma.weeklyChallengeProgress.findMany({
      where: { weekStart: start, accountId: { in: links.map((link) => link.accountId) } }
    });

    return {
      weekStart: toIsoDate(start) ?? '',
      endsAt: end.toISOString(),
      challenges: WEEKLY_CHALLENGES.map((definition) => ({
        code: definition.code,
        metric: definition.metric,
        target: definition.target,
        threshold: 'threshold' in definition ? definition.threshold : null,
        vehicleType: 'vehicleType' in definition ? definition.vehicleType : null,
        badgeCode: badgeCodeOf(definition),
        progress: progress
          .filter((row) => row.code === definition.code)
          .map((row) => ({ accountId: Number(row.accountId), value: row.progress, completedAt: row.completedAt?.toISOString() ?? null }))
      }))
    };
  }

  async evaluate(now: Date): Promise<number> {
    await this.ensureBadges();

    const { start, end } = weekWindow(now);
    const links = await this.prisma.userLestaAccount.findMany({
      select: { accountId: true },
      distinct: ['accountId'],
      take: CHALLENGE_BADGES.maxAccountsPerRun
    });

    const accountIds = links.map((link) => link.accountId);
    const stats = await this.weekStats({ accountIds, start, end });
    let completed = 0;

    for (const accountId of accountIds) {
      const own = stats.get(accountId);

      if (!own) {
        continue;
      }

      for (const definition of WEEKLY_CHALLENGES) {
        completed += (await this.record({ accountId, weekStart: start, definition, stats: own, now })) ? 1 : 0;
      }
    }

    this.logger.log(`weekly challenges: ${accountIds.length} accounts, ${completed} completed`);

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
      this.prisma.battle.findMany({
        where: { accountId: { in: accountIds }, startedAt: { gte: start, lt: end } },
        select: { accountId: true, tankId: true, damageDealt: true }
      }),
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
    const result = new Map<bigint, WeekStats>();

    for (const accountId of accountIds) {
      const own = sessions.filter((row) => row.accountId === accountId);
      const fromMod = battles.filter((row) => row.accountId === accountId);
      const fromApi = deltas.filter((row) => row.accountId === accountId);
      const source = fromMod.length >= fromApi.length ? fromMod : fromApi;

      result.set(accountId, {
        battles: own.reduce((total, row) => total + row.battles, 0),
        wins: own.reduce((total, row) => total + row.wins, 0),
        spotted: own.reduce((total, row) => total + row.spotted, 0),
        marks: marks.get(accountId) ?? 0,
        bigDamage: source.map((row) => ({ damage: row.damageDealt, vehicleType: typeOf.get(row.tankId) ?? null }))
      });
    }

    return result;
  }

  private async ensureBadges(): Promise<void> {
    await this.prisma.$transaction(
      WEEKLY_CHALLENGES.map((definition, order) =>
        this.prisma.badgeDefinition.upsert({
          where: { code: badgeCodeOf(definition) },
          create: { code: badgeCodeOf(definition), category: CHALLENGE_BADGES.category, criteria: toJsonValue(definition), order },
          update: { criteria: toJsonValue(definition), order, isActive: true }
        })
      )
    );
  }
}
