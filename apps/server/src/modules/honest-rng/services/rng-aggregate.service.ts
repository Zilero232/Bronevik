import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { groupBy, prop } from 'remeda';

import type { RngPeriod } from '../honest-rng.types';
import type { RollTally } from '../lib';

import { Prisma } from '../../../../generated';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { readStoredShots } from '../../analytics';
import { HONEST_RNG_AGGREGATE, RNG_PERIODS } from '../config';
import { emptyTally, foldBattle, tallySummary } from '../lib';

@Injectable()
export class RngAggregateService {
  constructor(private readonly prisma: PrismaService) {}

  async compute(now = new Date()) {
    const vehicles = await this.prisma.vehicle.findMany({ select: { tankId: true, tier: true } });
    const tiers = new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle.tier]));
    const starts = RNG_PERIODS.map((period) => {
      const days = HONEST_RNG_AGGREGATE.periodDays[period];

      return { period, from: days === null ? null : subDays(now, days) };
    });

    const tallies = new Map<string, { scope: string; period: RngPeriod; tally: RollTally }>();
    const tallyOf = (scope: string, period: RngPeriod): RollTally => {
      const key = `${scope}|${period}`;
      const existing = tallies.get(key);

      if (existing) {
        return existing.tally;
      }

      const tally = emptyTally();

      tallies.set(key, { scope, period, tally });

      return tally;
    };

    let cursor: string | undefined;
    let battles = 0;
    let hasMore = true;

    while (hasMore) {
      const chunk = await this.prisma.battle.findMany({
        where: { shots: { not: Prisma.DbNull }, startedAt: { lte: now }, ...(cursor ? { id: { gt: cursor } } : {}) },
        orderBy: { id: 'asc' },
        take: HONEST_RNG_AGGREGATE.chunk,
        select: { id: true, accountId: true, tankId: true, startedAt: true, shots: true, shotsFired: true, shotsHit: true, shotsPierced: true }
      });

      for (const battle of chunk) {
        const shots = readStoredShots(battle.shots);
        const accountId = String(battle.accountId);
        const tier = tiers.get(battle.tankId);
        const accuracy = { fired: battle.shotsFired ?? 0, hit: battle.shotsHit ?? 0, pierced: battle.shotsPierced ?? 0 };
        const shells = Object.entries(groupBy(shots, prop('shell')));

        for (const { period, from } of starts) {
          if (from !== null && battle.startedAt < from) {
            continue;
          }

          foldBattle({ tally: tallyOf(HONEST_RNG_AGGREGATE.scopes.server, period), accountId, shots, accuracy });

          if (tier !== undefined) {
            foldBattle({ tally: tallyOf(`${HONEST_RNG_AGGREGATE.scopes.tier}:${tier}`, period), accountId, shots, accuracy });
          }

          for (const [shell, group] of shells) {
            foldBattle({ tally: tallyOf(`${HONEST_RNG_AGGREGATE.scopes.shell}:${shell}`, period), accountId, shots: group, accuracy: null });
          }
        }
      }

      battles += chunk.length;
      cursor = chunk.at(-1)?.id;
      hasMore = chunk.length === HONEST_RNG_AGGREGATE.chunk;
    }

    const rows = [...tallies.values()].map(({ scope, period, tally }) => {
      const { buckets, ...summary } = tallySummary(tally);

      return { scope, period, ...summary, buckets: toJsonValue(buckets), computedAt: now };
    });

    await this.prisma.$transaction([this.prisma.rngAggregate.deleteMany(), this.prisma.rngAggregate.createMany({ data: rows })]);

    return { battles, rows: rows.length };
  }
}
