import type { MapSamplesInput } from './map-samples.types';

import { Prisma } from '../../../../../generated';

export const mapSamplesSql = ({ scope, since, battleType }: MapSamplesInput): Prisma.Sql => {
  const battleScope = 'tankId' in scope ? Prisma.sql`b.tank_id = ${scope.tankId}` : Prisma.sql`b.arena_id = ${scope.arenaId}`;
  const replayScope = 'tankId' in scope ? Prisma.sql`r.tank_id = ${scope.tankId}` : Prisma.sql`r.arena_id = ${scope.arenaId}`;
  const groupKey = 'tankId' in scope ? Prisma.sql`arena_id` : Prisma.sql`tank_id::text`;

  return Prisma.sql`
    WITH samples AS (
      SELECT b.account_id, b.arena_unique_id, b.tank_id, b.arena_id, b.result::text AS result, b.damage_dealt
      FROM battle b
      WHERE ${battleScope} AND b.battle_type = ${battleType} AND b.started_at >= ${since}
      UNION ALL
      SELECT r.account_id, r.arena_unique_id, r.tank_id, r.arena_id, r.result::text AS result, r.damage_dealt
      FROM replay r
      WHERE ${replayScope}
        AND r.battle_type = ${battleType}
        AND r.status = 'parsed'
        AND r.visibility <> 'private'
        AND r.played_at >= ${since}
        AND r.account_id IS NOT NULL
        AND r.arena_unique_id IS NOT NULL
        AND r.tank_id IS NOT NULL
        AND r.arena_id IS NOT NULL
        AND r.result IS NOT NULL
        AND r.damage_dealt IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM battle b WHERE b.account_id = r.account_id AND b.arena_unique_id = r.arena_unique_id)
    ),
    distinct_samples AS (
      SELECT DISTINCT ON (account_id, arena_unique_id) arena_id, tank_id, result, damage_dealt
      FROM samples
      ORDER BY account_id, arena_unique_id
    )
    SELECT ${groupKey} AS key,
           count(*)::int AS battles,
           (count(*) FILTER (WHERE result = 'win'))::int AS wins,
           avg(damage_dealt)::float8 AS "avgDamage"
    FROM distinct_samples
    GROUP BY 1
    ORDER BY battles DESC, key
  `;
};
