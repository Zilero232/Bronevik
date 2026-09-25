import type { Paginated, TankServerStatsRow } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { TankStatsListInput } from '../tanks.types';

import { COHORT_TO_DB, page, SERVER_PERIOD_TO_DB, sortRows, STATS_MODE_TO_DB } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { toServerStatsRow } from '../lib';

@Injectable()
export class TankStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService
  ) {}

  async list(query: TankStatsListInput): Promise<Paginated<TankServerStatsRow>> {
    const [rows, eligible] = await Promise.all([
      this.prisma.tankServerStats.findMany({
        where: {
          mode: STATS_MODE_TO_DB[query.mode],
          period: SERVER_PERIOD_TO_DB[query.period],
          cohort: COHORT_TO_DB[query.cohort],
          battles: { gte: query.minBattles }
        }
      }),
      this.catalog.filter(query)
    ]);

    const vehicles = new Map(eligible.map((entry) => [entry.summary.tankId, entry.summary]));

    const items = rows.flatMap((row) => {
      const vehicle = vehicles.get(row.tankId);

      return vehicle ? [toServerStatsRow({ row, vehicle, period: query.period, cohort: query.cohort, mode: query.mode })] : [];
    });

    const sorted = sortRows({
      rows: items,
      order: query.order,
      value: (row) =>
        match(query.sort ?? 'battles')
          .with('battles', () => row.battles)
          .with('players', () => row.players)
          .with('winRate', () => row.winRate)
          .with('winRateDiff', () => row.winRateDiff)
          .with('avgDamage', () => row.avgDamage)
          .with('avgFrags', () => row.avgFrags)
          .with('avgSpotted', () => row.avgSpotted)
          .with('survivalRate', () => row.survivalRate)
          .with('accuracy', () => row.accuracy)
          .with('tier', () => row.vehicle.tier)
          .exhaustive()
    });

    return page({ items: sorted, limit: query.limit, offset: query.offset });
  }
}
