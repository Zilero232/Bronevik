import type { PlayerInsights } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { InsightsInput } from '../players.types';

import { RATING_PERIOD_TO_DB } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { PLAYER_STATS } from '../config';
import { computeInsights } from '../lib';

@Injectable()
export class PlayerInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService
  ) {}

  async insights({ accountId, period }: InsightsInput): Promise<PlayerInsights> {
    const { mode, period: serverPeriod, cohort } = PLAYER_STATS.serverReference;

    const [ratings, server, catalog] = await Promise.all([
      this.prisma.accountTankRating.findMany({ where: { accountId, period: RATING_PERIOD_TO_DB[period] } }),
      this.prisma.tankServerStats.findMany({ where: { mode, period: serverPeriod, cohort } }),
      this.catalog.all()
    ]);

    const serverOf = new Map(server.map((row) => [row.tankId, row]));

    const tanks = ratings.flatMap((rating) => {
      const entry = catalog.get(rating.tankId);
      const reference = serverOf.get(rating.tankId);

      if (!entry) {
        return [];
      }

      return [
        {
          tankId: rating.tankId,
          type: entry.summary.type,
          tier: entry.summary.tier,
          battles: rating.battles,
          winRate: rating.winRate,
          avgDamage: rating.avgDamage,
          serverWinRate: reference?.winRate ?? null,
          serverAvgDamage: reference?.avgDamage ?? null
        }
      ];
    });

    const minBattles = period === 'overall' ? PLAYER_STATS.insightsMinBattles.overall : PLAYER_STATS.insightsMinBattles.recent;
    const insights = computeInsights({ tanks, minBattles });

    const withVehicle = (list: typeof insights.weakTanks) =>
      list.flatMap((tank) => {
        const entry = catalog.get(tank.tankId);

        return entry ? [{ ...tank, vehicle: entry.summary }] : [];
      });

    return {
      period,
      battles: insights.battles,
      byClass: insights.byClass,
      byTier: insights.byTier,
      weakTanks: withVehicle(insights.weakTanks),
      strongTanks: withVehicle(insights.strongTanks),
      tips: insights.tips
    };
  }
}
