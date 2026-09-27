import type { FacetSqlInput, FacetsScope } from './best-battles-facets.types';

import { Prisma } from '../../../../../generated';
import { feedScopeSql } from '../best-battles-feed';

const facetFeedSql = (scope: FacetsScope): Prisma.Sql => {
  const feed = { ...scope, tankIds: null };

  return Prisma.sql`
    WITH feed AS (
      SELECT b.tank_id, b.arena_id, b.damage_dealt AS damage, b.achievements AS medals
      FROM battle b
      JOIN player p ON p.account_id = b.account_id AND NOT p.is_hidden
      WHERE ${feedScopeSql.mod(feed)}
      UNION ALL
      SELECT r.tank_id, r.arena_id, r.damage_dealt AS damage, r.medals
      FROM replay r
      LEFT JOIN player p ON p.account_id = r.account_id
      WHERE ${feedScopeSql.replay(feed)}
    )
  `;
};

export const facetTotalsSql = (scope: FacetsScope): Prisma.Sql => Prisma.sql`
  ${facetFeedSql(scope)}
  SELECT count(*)::int AS battles, max(damage)::int AS top_damage FROM feed
`;

export const facetMedalsSql = ({ take, ...scope }: FacetSqlInput): Prisma.Sql => Prisma.sql`
  ${facetFeedSql(scope)}
  SELECT medal AS key, count(*)::int AS battles
  FROM feed, unnest(feed.medals) AS medal
  GROUP BY medal
  ORDER BY battles DESC, medal
  LIMIT ${take}
`;

export const facetTanksSql = ({ take, ...scope }: FacetSqlInput): Prisma.Sql => Prisma.sql`
  ${facetFeedSql(scope)}
  SELECT tank_id::text AS key, count(*)::int AS battles
  FROM feed
  GROUP BY tank_id
  ORDER BY battles DESC, tank_id
  LIMIT ${take}
`;

export const facetArenasSql = ({ take, ...scope }: FacetSqlInput): Prisma.Sql => Prisma.sql`
  ${facetFeedSql(scope)}
  SELECT arena_id AS key, count(*)::int AS battles
  FROM feed
  WHERE arena_id IS NOT NULL
  GROUP BY arena_id
  ORDER BY battles DESC, arena_id
  LIMIT ${take}
`;
