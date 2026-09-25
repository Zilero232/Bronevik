import type { TankTrend } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { startOfDay, subDays } from 'date-fns';

import type { TankTrendInput, TrendRow } from '../tanks.types';

import { STATS_MODE_SQL } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { TANK_TREND_SQL } from '../config';
import { toTrendPoints } from '../lib';

@Injectable()
export class TankTrendService {
  constructor(private readonly prisma: PrismaService) {}

  async trend({ tankId, query }: TankTrendInput): Promise<TankTrend> {
    const from = startOfDay(subDays(new Date(), query.days - 1));

    const rows = await this.prisma.$queryRaw<TrendRow[]>`
      SELECT to_char(captured_at AT TIME ZONE ${TANK_TREND_SQL.timeZone}, 'YYYY-MM-DD') AS day,
             sum(battles)::float8 AS battles,
             sum(wins)::float8 AS wins,
             sum(damage_dealt)::float8 AS damage,
             count(DISTINCT account_id)::float8 AS players
      FROM tank_battle_delta
      WHERE tank_id = ${tankId} AND mode = ${STATS_MODE_SQL[query.mode]}::stats_mode AND captured_at >= ${from}
      GROUP BY 1
      ORDER BY 1
    `;

    return { tankId, mode: query.mode, days: query.days, points: toTrendPoints(rows) };
  }
}
