import type { PlayerMarks } from '@bronevik/schemas';

import { MOE } from '@bronevik/ratings';
import { Injectable } from '@nestjs/common';
import { sortBy } from 'remeda';

import type { CombinedDamageRow } from '../players.types';

import { toIso } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { ThresholdsService, VehicleCatalogService } from '../../reference';
import { PLAYER_MARKS } from '../config';
import { combinedSource, nextMark } from '../lib';

@Injectable()
export class PlayerMarksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly thresholds: ThresholdsService
  ) {}

  async marks(accountId: bigint): Promise<PlayerMarks> {
    const [tanks, progress, { moe }, catalog, combined, ratings] = await Promise.all([
      this.prisma.playerTank.findMany({ where: { accountId } }),
      this.prisma.moeProgress.findMany({ where: { accountId } }),
      this.thresholds.latest(),
      this.catalog.all(),
      this.combinedDamage(accountId),
      this.prisma.accountTankRating.findMany({ where: { accountId, period: 'overall' }, select: { tankId: true, avgDamage: true } })
    ]);

    const progressOf = new Map(progress.map((row) => [row.tankId, row]));
    const combinedOf = new Map(combined.map((row) => [row.tank_id, row.combined]));
    const damageOf = new Map(ratings.map((row) => [row.tankId, row.avgDamage]));

    const items = tanks
      .filter((tank) => (catalog.get(tank.tankId)?.summary.tier ?? 0) >= PLAYER_MARKS.minTier)
      .map((tank) => {
        const current = progressOf.get(tank.tankId);
        const threshold = moe.get(tank.tankId);
        const thresholds = threshold ? { p65: threshold.p65, p85: threshold.p85, p95: threshold.p95, p100: threshold.p100 } : null;
        const moePercent = current ? Math.min(MOE.maxPercent, Math.max(0, current.percent)) : null;
        const target = nextMark({
          percent: moePercent,
          marksOnGun: current?.marks ?? tank.marksOnGun,
          thresholds,
          movingDamage: current?.movingDamage ?? null
        });

        const fromBattles = combinedOf.get(tank.tankId);
        const fromRating = damageOf.get(tank.tankId);

        return {
          vehicle: catalog.get(tank.tankId)?.summary ?? null,
          battles: tank.battles,
          marksOnGun: current?.marks ?? tank.marksOnGun,
          markOfMastery: Math.min(4, Math.max(0, tank.markOfMastery)),
          moePercent,
          movingDamage: current?.movingDamage ?? null,
          avgCombinedDamage: fromBattles ?? fromRating ?? null,
          combinedDamageSource: combinedSource({ fromBattles, fromRating }),
          thresholds,
          nextMarkPercent: target.percent,
          damageToNextMark: target.damage,
          updatedAt: toIso(current?.updatedAt ?? tank.updatedAt)
        };
      })
      .flatMap((item) => (item.vehicle ? [{ ...item, vehicle: item.vehicle }] : []));

    const count = (marks: number) => items.filter((item) => item.marksOnGun === marks).length;

    return {
      summary: {
        moe3: count(3),
        moe2: count(2),
        moe1: count(1),
        mastery: items.filter((item) => item.markOfMastery === 4).length,
        eligible: items.length
      },
      items: sortBy(items, [(item) => item.damageToNextMark ?? Number.POSITIVE_INFINITY, 'asc'], [(item) => item.battles, 'desc'])
    };
  }

  private async combinedDamage(accountId: bigint): Promise<CombinedDamageRow[]> {
    return this.prisma.$queryRaw<CombinedDamageRow[]>`
      SELECT tank_id, count(*)::float8 AS battles,
             avg(damage_dealt + greatest(damage_assisted_radio, damage_assisted_track, damage_assisted_stun))::float8 AS combined
      FROM (
        SELECT tank_id, damage_dealt, damage_assisted_radio, damage_assisted_track, damage_assisted_stun,
               row_number() OVER (PARTITION BY tank_id ORDER BY started_at DESC) AS position
        FROM battle
        WHERE account_id = ${accountId}
      ) recent
      WHERE position <= ${PLAYER_MARKS.combinedDamageBattles}
      GROUP BY tank_id
    `;
  }
}
