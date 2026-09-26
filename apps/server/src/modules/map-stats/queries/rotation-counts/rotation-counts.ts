import type { StatsWindow } from '../../lib';

import { Prisma } from '../../../../../generated';
import { MAP_STATS } from '../../config';
import { bonusModesSql } from '../bonus-modes';

export const rotationCountsSql = ({ from, to }: StatsWindow): Prisma.Sql => Prisma.sql`
  WITH modes AS (
    SELECT * FROM ${bonusModesSql()} AS m(battle_type, mode)
  ),
  samples AS (
    SELECT b.arena_unique_id AS uid, b.arena_id, v.tier::int AS tier, m.mode, 'mod' AS src
    FROM battle b
    JOIN vehicle v ON v.tank_id = b.tank_id
    JOIN modes m ON m.battle_type = b.battle_type
    WHERE b.started_at >= ${from} AND b.started_at <= ${to}
    UNION ALL
    SELECT r.arena_unique_id AS uid, r.arena_id, v.tier::int AS tier, m.mode, 'replay' AS src
    FROM replay r
    JOIN vehicle v ON v.tank_id = r.tank_id
    JOIN modes m ON m.battle_type = r.battle_type
    WHERE r.status = 'parsed'
      AND r.arena_id IS NOT NULL
      AND r.arena_unique_id IS NOT NULL
      AND r.played_at >= ${from}
      AND r.played_at <= ${to}
  )
  SELECT arena_id AS "arenaId",
         COALESCE(tier, ${MAP_STATS.allTiers})::int AS tier,
         mode,
         count(DISTINCT uid)::int AS battles,
         count(DISTINCT uid) FILTER (WHERE src = 'mod')::int AS "modBattles",
         count(DISTINCT uid) FILTER (WHERE src = 'replay')::int AS "replayBattles"
  FROM samples
  GROUP BY GROUPING SETS ((arena_id, tier, mode), (arena_id, mode))
`;
