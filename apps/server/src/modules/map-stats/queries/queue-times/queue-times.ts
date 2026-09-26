import type { StatsWindow } from '../../lib';

import { Prisma } from '../../../../../generated';
import { MAP_STATS } from '../../config';
import { bonusModesSql } from '../bonus-modes';

export const queueTimesSql = ({ from, to }: StatsWindow): Prisma.Sql => Prisma.sql`
  WITH modes AS (
    SELECT * FROM ${bonusModesSql()} AS m(battle_type, mode)
  ),
  samples AS (
    SELECT m.mode,
           v.tier::int AS tier,
           EXTRACT(HOUR FROM b.started_at AT TIME ZONE ${MAP_STATS.timezone})::int AS hour,
           b.queue_time_ms::float8 / ${MAP_STATS.msPerSecond} AS wait_sec
    FROM battle b
    JOIN vehicle v ON v.tank_id = b.tank_id
    JOIN modes m ON m.battle_type = b.battle_type
    WHERE b.queue_time_ms IS NOT NULL
      AND b.started_at >= ${from}
      AND b.started_at <= ${to}
  )
  SELECT COALESCE(tier, ${MAP_STATS.allTiers})::int AS tier,
         hour,
         mode,
         count(*)::int AS samples,
         avg(wait_sec)::float8 AS "avgSec",
         percentile_cont(0.5) WITHIN GROUP (ORDER BY wait_sec)::float8 AS "medianSec",
         percentile_cont(0.9) WITHIN GROUP (ORDER BY wait_sec)::float8 AS "p90Sec"
  FROM samples
  GROUP BY GROUPING SETS ((mode, tier, hour), (mode, hour))
`;
