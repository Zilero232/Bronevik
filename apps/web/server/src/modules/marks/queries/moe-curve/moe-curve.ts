import type { MoeCurveSqlInput } from './moe-curve.types';

import { Prisma } from '../../../../../generated';

export const moeCurveSql = ({ tankId, since, steps, band, battleType }: MoeCurveSqlInput): Prisma.Sql => Prisma.sql`
  WITH recent AS (
    SELECT account_id, moe_percent, moe_moving_avg
    FROM battle
    WHERE tank_id = ${tankId}
      AND battle_type = ${battleType}
      AND started_at >= ${since}
      AND moe_percent IS NOT NULL
      AND moe_moving_avg IS NOT NULL
      AND moe_moving_avg > 0
  ),
  stepped AS (
    SELECT step.value AS percent, recent.account_id, recent.moe_moving_avg
    FROM recent
    JOIN unnest(${steps}::int[]) AS step(value) ON abs(recent.moe_percent - step.value) <= ${band}
  ),
  per_player AS (
    SELECT percent, account_id, percentile_cont(0.5) WITHIN GROUP (ORDER BY moe_moving_avg) AS damage, count(*) AS battles
    FROM stepped
    GROUP BY percent, account_id
  )
  SELECT percent,
         percentile_cont(0.5) WITHIN GROUP (ORDER BY damage)::float8 AS damage,
         count(*)::int AS players,
         sum(battles)::int AS battles
  FROM per_player
  GROUP BY percent
  ORDER BY percent
`;
