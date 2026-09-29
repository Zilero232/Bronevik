import type { PlayerMarks } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { sortBy } from 'remeda';

import type { CombinedDamageRow } from '../queries';

import { PrismaService } from '../../../core';
import { ThresholdsService, VehicleCatalogService } from '../../reference';
import { PLAYER_MARKS } from '../config';
import { marksSummary } from '../lib';
import { toPlayerMark } from '../mappers';
import { combinedDamageSql } from '../queries';

@Injectable()
export class PlayerMarksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly thresholds: ThresholdsService
  ) {}

  async marks(accountId: bigint): Promise<PlayerMarks> {
    const [tanks, { moe }, catalog, combined, ratings] = await Promise.all([
      this.prisma.playerTank.findMany({ where: { accountId } }),
      this.thresholds.latest(),
      this.catalog.all(),
      this.combinedDamage(accountId),
      this.prisma.accountTankRating.findMany({ where: { accountId, period: 'overall' }, select: { tankId: true, avgDamage: true } })
    ]);

    const combinedOf = new Map(combined.map((row) => [row.tank_id, row.combined]));
    const damageOf = new Map(ratings.map((row) => [row.tankId, row.avgDamage]));

    const items = tanks.flatMap((tank) => {
      const vehicle = catalog.get(tank.tankId)?.summary;

      if (!vehicle || vehicle.tier < PLAYER_MARKS.minTier) {
        return [];
      }

      return [
        toPlayerMark({
          tank,
          vehicle,
          threshold: moe.get(tank.tankId),
          fromBattles: combinedOf.get(tank.tankId),
          fromRating: damageOf.get(tank.tankId)
        })
      ];
    });

    return {
      summary: marksSummary(items),
      items: sortBy(items, [(item) => item.damageToNextMark ?? Number.POSITIVE_INFINITY, 'asc'], [(item) => item.battles, 'desc'])
    };
  }
  private async combinedDamage(accountId: bigint): Promise<CombinedDamageRow[]> {
    return this.prisma.$queryRaw<CombinedDamageRow[]>(combinedDamageSql(accountId));
  }
}
