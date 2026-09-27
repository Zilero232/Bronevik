import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { LearningSqlRow } from '../lib/tank-economy';

import { PrismaService } from '../../../../core';
import { LEARNING_CURVE_AGGREGATE } from '../config';
import { toLearningRecord } from '../lib/tank-economy';

@Injectable()
export class LearningCurveService {
  constructor(private readonly prisma: PrismaService) {}

  async compute() {
    const computedAt = new Date();
    const { windowDays, maxBattleDelta, minBattles } = LEARNING_CURVE_AGGREGATE;
    const starts = [...LEARNING_CURVE_AGGREGATE.bucketStarts];

    const since = subDays(computedAt, windowDays);

    const rows = await this.prisma.$queryRaw<LearningSqlRow[]>`
      WITH windowed AS (
        SELECT account_id, tank_id, captured_at, battles, wins, damage_dealt
        FROM tank_snapshot
        WHERE mode = 'random' AND captured_at > ${since}
      ),
      series AS (
        SELECT * FROM windowed
        UNION ALL
        SELECT base.*
        FROM (SELECT DISTINCT account_id, tank_id FROM windowed) pair
        CROSS JOIN LATERAL (
          SELECT account_id, tank_id, captured_at, battles, wins, damage_dealt
          FROM tank_snapshot
          WHERE account_id = pair.account_id AND tank_id = pair.tank_id AND mode = 'random' AND captured_at <= ${since}
          ORDER BY captured_at DESC
          LIMIT 1
        ) base
      ),
      deltas AS (
        SELECT
          tank_id,
          account_id,
          lag(battles) OVER w AS prev_battles,
          battles - lag(battles) OVER w AS battles_delta,
          wins - lag(wins) OVER w AS wins_delta,
          damage_dealt::bigint - lag(damage_dealt::bigint) OVER w AS damage_delta
        FROM series
        WINDOW w AS (PARTITION BY account_id, tank_id ORDER BY captured_at)
      )
      SELECT
        tank_id,
        (width_bucket(prev_battles, ${starts}::int[]) - 1)::int AS bucket,
        sum(battles_delta)::int AS battles,
        count(DISTINCT account_id)::int AS players,
        sum(wins_delta)::int AS wins,
        sum(damage_delta)::bigint AS damage
      FROM deltas
      WHERE battles_delta > 0 AND battles_delta <= ${maxBattleDelta} AND wins_delta >= 0 AND damage_delta >= 0
      GROUP BY 1, 2
      HAVING sum(battles_delta) >= ${minBattles}
    `;

    await this.prisma.$transaction([
      this.prisma.tankLearningCurve.deleteMany({}),
      this.prisma.tankLearningCurve.createMany({ data: rows.map((row) => toLearningRecord({ row, windowDays, computedAt })) })
    ]);

    return { rows: rows.length };
  }
}
