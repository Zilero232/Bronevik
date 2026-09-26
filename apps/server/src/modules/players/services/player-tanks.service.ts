import type { Paginated, PlayerTankRow } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { LatestTankSnapshot, PlayerTanksInput } from '../players.types';

import { emptyRating, page, percentOf, RATING_PERIOD_TO_DB, ratingValue, ratio, sortRows, toIso } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { statsBlockFromRating } from '../lib';

@Injectable()
export class PlayerTanksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService
  ) {}

  async list({ accountId, query }: PlayerTanksInput): Promise<Paginated<PlayerTankRow>> {
    const [tanks, snapshots, ratings, progress, recent, eligible] = await Promise.all([
      this.prisma.playerTank.findMany({ where: { accountId, battles: { gte: query.minBattles } } }),
      this.latestSnapshots(accountId),
      this.prisma.accountTankRating.findMany({ where: { accountId, period: 'overall' } }),
      this.prisma.moeProgress.findMany({ where: { accountId } }),
      query.period
        ? this.prisma.accountTankRating.findMany({ where: { accountId, period: RATING_PERIOD_TO_DB[query.period] } })
        : Promise.resolve([]),
      this.catalog.filter(query)
    ]);

    const allowed = new Set(eligible.map((entry) => entry.summary.tankId));
    const snapshotOf = new Map(snapshots.map((row) => [row.tank_id, row]));
    const ratingOf = new Map(ratings.map((row) => [row.tankId, row]));
    const progressOf = new Map(progress.map((row) => [row.tankId, row]));
    const recentOf = new Map(recent.map((row) => [row.tankId, row]));

    const rows = await Promise.all(
      tanks
        .filter((tank) => allowed.has(tank.tankId))
        .map(async (tank): Promise<PlayerTankRow> => {
          const snapshot = snapshotOf.get(tank.tankId);
          const rating = ratingOf.get(tank.tankId);
          const moe = progressOf.get(tank.tankId);
          const period = recentOf.get(tank.tankId);
          const battles = snapshot?.battles ?? tank.battles;

          return {
            vehicle: await this.catalog.summary(tank.tankId),
            battles,
            winRate: percentOf({ value: snapshot?.wins ?? tank.wins, by: battles }),
            avgDamage: snapshot ? ratio({ value: snapshot.damage_dealt, by: snapshot.battles }) : (rating?.avgDamage ?? null),
            avgFrags: snapshot ? ratio({ value: snapshot.frags, by: snapshot.battles }) : (rating?.avgFrags ?? null),
            avgXp: snapshot ? ratio({ value: snapshot.xp, by: snapshot.battles }) : (rating?.avgXp ?? null),
            survivalRate: snapshot ? percentOf({ value: snapshot.survived_battles, by: snapshot.battles }) : null,
            wn8: rating ? ratingValue({ kind: 'wn8', value: rating.wn8 }) : emptyRating(),
            markOfMastery: Math.min(4, Math.max(0, tank.markOfMastery)),
            marksOnGun: moe?.marks ?? tank.marksOnGun,
            moePercent: moe ? Math.min(100, Math.max(0, moe.percent)) : null,
            damagePercentile: rating?.damagePercentile ?? null,
            maxFrags: snapshot?.max_frags ?? null,
            maxXp: snapshot?.max_xp ?? null,
            lastBattleAt: toIso(tank.lastBattleAt),
            recent:
              query.period && period ? { period: query.period, from: null, to: toIso(period.computedAt), stats: statsBlockFromRating(period) } : null
          };
        })
    );

    const sorted = sortRows({
      rows,
      order: query.order,
      value: (row) =>
        match(query.sort ?? 'battles')
          .with('battles', () => row.battles)
          .with('winRate', () => row.winRate)
          .with('avgDamage', () => row.avgDamage)
          .with('wn8', () => row.wn8.value)
          .with('marksOnGun', () => row.marksOnGun)
          .with('moePercent', () => row.moePercent)
          .with('lastBattleAt', () => row.lastBattleAt)
          .with('tier', () => row.vehicle.tier)
          .exhaustive()
    });

    return query.limit === 'all'
      ? page({ items: sorted, limit: Math.max(1, sorted.length), offset: 0 })
      : page({ items: sorted, limit: query.limit, offset: query.offset });
  }

  private async latestSnapshots(accountId: bigint): Promise<LatestTankSnapshot[]> {
    return this.prisma.$queryRaw<LatestTankSnapshot[]>`
      SELECT DISTINCT ON (tank_id) tank_id, battles, wins, damage_dealt, frags, xp, survived_battles, max_frags, max_xp
      FROM tank_snapshot
      WHERE account_id = ${accountId} AND mode = 'random'::stats_mode
      ORDER BY tank_id, captured_at DESC
    `;
  }
}
