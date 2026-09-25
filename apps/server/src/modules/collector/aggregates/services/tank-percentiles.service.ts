import { BRONYA_INDEX } from '@bronevik/ratings';
import { utc } from '@date-fns/utc';
import { Injectable } from '@nestjs/common';
import { startOfDay, subDays } from 'date-fns';

import type { PercentileRow } from '../aggregates.types';

import { toJsonValue } from '../../../../common/lib';
import { PrismaService } from '../../../../core';
import { BRONYA_REFERENCE, bronyaReferencePayload } from '../lib/bronya-reference';
import { ReferenceTablesService } from './reference-tables.service';

@Injectable()
export class TankPercentilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tables: ReferenceTablesService
  ) {}

  async compute() {
    const now = new Date();
    const levels = [...BRONYA_INDEX.quantileLevels];

    const rows = await this.prisma.$queryRaw<PercentileRow[]>`
      WITH latest AS (
        SELECT DISTINCT ON (account_id, tank_id)
          tank_id, battles, wins, damage_dealt, frags, spotted, dropped_capture_points
        FROM tank_snapshot
        WHERE mode = 'random' AND captured_at > ${subDays(now, BRONYA_REFERENCE.windowDays)}
        ORDER BY account_id, tank_id, captured_at DESC
      )
      SELECT
        tank_id,
        count(*)::int AS players,
        percentile_cont(${levels}::float8[]) WITHIN GROUP (ORDER BY damage_dealt::float8 / battles) AS damage,
        percentile_cont(${levels}::float8[]) WITHIN GROUP (ORDER BY wins * 100.0 / battles) AS win_rate,
        percentile_cont(${levels}::float8[]) WITHIN GROUP (ORDER BY frags::float8 / battles) AS frags,
        percentile_cont(${levels}::float8[]) WITHIN GROUP (ORDER BY spotted::float8 / battles) AS spotted,
        percentile_cont(${levels}::float8[]) WITHIN GROUP (ORDER BY dropped_capture_points::float8 / battles) AS defence
      FROM latest
      WHERE battles >= ${BRONYA_REFERENCE.minTankBattles}
      GROUP BY tank_id
      HAVING count(*) >= ${BRONYA_REFERENCE.minPlayers}
    `;

    const date = startOfDay(now, { in: utc });

    await this.prisma.$transaction([
      this.prisma.tankPercentile.deleteMany({ where: { distribution: BRONYA_REFERENCE.distribution, date } }),
      this.prisma.tankPercentile.createMany({
        data: rows.map((row) => ({
          tankId: row.tank_id,
          date,
          distribution: BRONYA_REFERENCE.distribution,
          percentiles: toJsonValue(
            bronyaReferencePayload({
              players: row.players,
              components: { damage: row.damage, winRate: row.win_rate, frags: row.frags, spotted: row.spotted, defence: row.defence }
            })
          )
        }))
      })
    ]);

    this.tables.invalidate();

    return { tanks: rows.length };
  }
}
