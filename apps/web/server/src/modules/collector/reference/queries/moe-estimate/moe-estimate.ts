import type { MoeEstimateSqlInput } from './moe-estimate.types';

import { Prisma } from '../../../../../../generated';

export const moeEstimateSql = ({ since, steps, band, battleType }: MoeEstimateSqlInput): Prisma.Sql => Prisma.sql`
  WITH recent AS (
    SELECT tank_id, account_id, moe_percent, moe_moving_avg
    FROM battle
    WHERE battle_type = ${battleType}
      AND started_at >= ${since}
      AND moe_percent IS NOT NULL
      AND moe_moving_avg IS NOT NULL
      AND moe_moving_avg > 0
  ),
  stepped AS (
    SELECT recent.tank_id, step.value AS percent, recent.account_id, recent.moe_moving_avg
    FROM recent
    JOIN unnest(${steps}::int[]) AS step(value) ON abs(recent.moe_percent - step.value) <= ${band}
  ),
  per_player AS (
    SELECT tank_id, percent, account_id, percentile_cont(0.5) WITHIN GROUP (ORDER BY moe_moving_avg) AS damage
    FROM stepped
    GROUP BY tank_id, percent, account_id
  )
  SELECT tank_id AS "tankId",
         percent,
         percentile_cont(0.5) WITHIN GROUP (ORDER BY damage)::float8 AS damage,
         count(*)::int AS players
  FROM per_player
  GROUP BY tank_id, percent
  ORDER BY tank_id, percent
`;
