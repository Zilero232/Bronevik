import { Injectable, Logger } from '@nestjs/common';
import { PROGRESSION_REWARDS, TANK_CHALLENGES, TANK_LEVELS, tankLevelOf } from '@otmetki/schemas';
import { subDays } from 'date-fns';
import { range, sortBy } from 'remeda';

import type { BattleSample } from '../lib';
import type { AccountRunInput, ApplyXpInput, EvaluateChallengesInput, LoadSamplesInput } from '../progression.types';

import { entitledSubscriptionWhere, errorMessage, toIsoDate, weekWindow } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { PROGRESSION_RUN } from '../config';
import {
  battlesOf,
  challengeKey,
  challengeProgress,
  levelKey,
  pickSamplesByTank,
  sampleFromBattle,
  sampleFromDelta,
  weeklyTankChallenges,
  xpOfSamples
} from '../lib';
import { SeasonService } from './season.service';
import { ShellLedgerService } from './shell-ledger.service';

@Injectable()
export class ProgressionRunService {
  private readonly logger = new Logger(ProgressionRunService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: ShellLedgerService,
    private readonly seasons: SeasonService
  ) {}

  async run(now: Date): Promise<number> {
    const subscriptions = await this.prisma.subscription.findMany({ where: entitledSubscriptionWhere(now), select: { userId: true } });
    const links = await this.prisma.userLestaAccount.findMany({
      where: { userId: { in: subscriptions.map((subscription) => subscription.userId) } },
      select: { userId: true, accountId: true },
      take: PROGRESSION_RUN.maxAccountsPerRun
    });

    await this.prisma.progressionCursor.updateMany({
      where: { accountId: { notIn: links.map((link) => link.accountId) } },
      data: { processedUntil: now }
    });

    let processed = 0;

    for (const link of links) {
      try {
        await this.runAccount({ userId: link.userId, accountId: link.accountId, now });
        processed += 1;
      } catch (error) {
        this.logger.warn(`progression for ${link.accountId} failed: ${errorMessage(error)}`);
      }
    }

    for (const userId of new Set(links.map((link) => link.userId))) {
      await this.seasons.claimRewards({ userId, now });
    }

    this.logger.log(`progression: ${processed} of ${links.length} accounts`);

    return processed;
  }

  private async runAccount({ userId, accountId, now }: AccountRunInput): Promise<void> {
    const { start } = weekWindow(now);
    const cursor = await this.prisma.progressionCursor.findUnique({ where: { accountId } });
    const from = cursor?.processedUntil ?? start;
    const fresh = await this.loadSamples({ accountId, from, to: now });
    const tiers = await this.tiers([...fresh.keys()]);
    const gains = new Map(
      [...fresh].map(([tankId, samples]) => [tankId, { xp: xpOfSamples({ samples, tier: tiers.get(tankId) ?? 1 }), battles: battlesOf(samples) }])
    );

    await this.applyXp({ userId, accountId, now, gains });
    await this.prisma.progressionCursor.upsert({ where: { accountId }, create: { accountId, processedUntil: now }, update: { processedUntil: now } });
    await this.evaluateChallenges({ userId, accountId, now, weekStart: start });
  }

  private async applyXp({ userId, accountId, now, gains }: ApplyXpInput): Promise<void> {
    for (const [tankId, gain] of gains) {
      if (gain.xp <= 0) {
        continue;
      }

      const before = await this.prisma.tankProgress.findUnique({ where: { accountId_tankId: { accountId, tankId } } });
      const xp = (before?.xp ?? 0) + gain.xp;
      const level = tankLevelOf(xp).level;
      const previous = before?.level ?? 1;

      await this.prisma.tankProgress.upsert({
        where: { accountId_tankId: { accountId, tankId } },
        create: { accountId, tankId, xp, level, battles: gain.battles },
        update: { xp: { increment: gain.xp }, level, battles: { increment: gain.battles } }
      });

      for (const reached of range(previous + 1, level + 1)) {
        await this.ledger.grant({
          userId,
          amount: PROGRESSION_REWARDS.levelShells + (reached === TANK_LEVELS.max ? PROGRESSION_REWARDS.maxLevelShells : 0),
          reason: 'level',
          key: levelKey({ accountId, tankId, level: reached }),
          points: PROGRESSION_REWARDS.levelPoints,
          now,
          context: { tankId, level: reached }
        });
      }
    }
  }

  private async evaluateChallenges({ userId, accountId, now, weekStart }: EvaluateChallengesInput): Promise<void> {
    const week = toIsoDate(weekStart) ?? '';
    const samples = await this.loadSamples({ accountId, from: weekStart, to: now });
    const tanks = sortBy([...samples], [([, rows]) => battlesOf(rows), 'desc']).slice(0, TANK_CHALLENGES.maxTanksPerWeek);
    const tiers = await this.tiers(tanks.map(([tankId]) => tankId));
    const hasModData =
      (await this.prisma.battle.count({ where: { accountId, startedAt: { gte: subDays(now, PROGRESSION_RUN.modLookbackDays) } } })) > 0;

    for (const [tankId, rows] of tanks) {
      const challenges = weeklyTankChallenges({ seed: `${accountId}:${tankId}:${week}`, tier: tiers.get(tankId) ?? 1, hasModData });

      for (const challenge of challenges) {
        const key = { accountId_tankId_weekStart_code: { accountId, tankId, weekStart, code: challenge.code } };
        const progress = challengeProgress({ challenge, samples: rows });
        const existing = await this.prisma.tankChallengeProgress.findUnique({ where: key, select: { completedAt: true } });
        const justCompleted = progress >= challenge.target && !existing?.completedAt;
        const completion = justCompleted ? { completedAt: now } : {};

        await this.prisma.tankChallengeProgress.upsert({
          where: key,
          create: {
            accountId,
            tankId,
            weekStart,
            code: challenge.code,
            metric: challenge.metric,
            threshold: challenge.threshold,
            target: challenge.target,
            progress,
            ...completion
          },
          update: { progress, ...completion }
        });

        if (justCompleted) {
          await this.ledger.grant({
            userId,
            amount: PROGRESSION_REWARDS.challengeShells,
            reason: 'challenge',
            key: challengeKey({ accountId, tankId, week, code: challenge.code }),
            points: PROGRESSION_REWARDS.challengePoints,
            now,
            context: { tankId, week, code: challenge.code }
          });
        }
      }
    }
  }

  private async loadSamples({ accountId, from, to }: LoadSamplesInput): Promise<Map<number, BattleSample[]>> {
    const [deltas, battles] = await Promise.all([
      this.prisma.tankBattleDelta.findMany({
        where: { accountId, mode: 'random', capturedAt: { gt: from, lte: to } },
        select: { tankId: true, battles: true, wins: true, damageDealt: true, spotted: true, frags: true, damageBlocked: true, survived: true }
      }),
      this.prisma.battle.findMany({
        where: { accountId, receivedAt: { gt: from, lte: to } },
        select: {
          tankId: true,
          result: true,
          damageDealt: true,
          spotted: true,
          frags: true,
          damageBlocked: true,
          survived: true,
          moePercentDelta: true
        }
      })
    ]);

    return pickSamplesByTank({ api: deltas.map(sampleFromDelta), mod: battles.map(sampleFromBattle) });
  }

  private async tiers(tankIds: number[]): Promise<Map<number, number>> {
    const vehicles = await this.prisma.vehicle.findMany({ where: { tankId: { in: tankIds } }, select: { tankId: true, tier: true } });

    return new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle.tier]));
  }
}
