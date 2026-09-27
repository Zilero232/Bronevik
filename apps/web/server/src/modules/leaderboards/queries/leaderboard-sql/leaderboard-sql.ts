import type { LeaderboardQuery } from '@otmetki/schemas';

import type { LeaderboardSqlInput, PlayersSqlInput, RisingStarsSqlInput } from './leaderboard-sql.types';

import { Prisma } from '../../../../../generated';
import { RATING_PERIOD_SQL } from '../../../../common/lib';
import { ACCOUNT_RATING_COLUMN, CLAN_SNAPSHOT_COLUMN, TANK_RATING_COLUMN } from '../../config';

export const streamersFilterSql = Prisma.sql`AND ar.account_id IN (SELECT account_id FROM streamer_profile WHERE account_id IS NOT NULL)`;

export const playersSql = ({ query, minBattles, filter = Prisma.empty }: PlayersSqlInput): Prisma.Sql => {
  const column = Prisma.raw(`ar.${ACCOUNT_RATING_COLUMN[query.metric]}`);

  return Prisma.sql`
    SELECT ar.account_id AS "accountId", NULL::bigint AS "clanId", coalesce(sp.display_name, p.nickname) AS name, c.tag AS "clanTag", NULL::text AS color,
           ${column}::float8 AS value, ar.battles::float8 AS battles, NULL::float8 AS delta, count(*) OVER () AS total
    FROM account_rating ar
    JOIN player p ON p.account_id = ar.account_id AND NOT p.is_hidden
    LEFT JOIN clan c ON c.clan_id = p.clan_id
    LEFT JOIN streamer_profile sp ON sp.account_id = ar.account_id
    WHERE ar.period = ${RATING_PERIOD_SQL[query.period]}::rating_period AND ar.battles >= ${minBattles} AND ${column} IS NOT NULL ${filter}
    ORDER BY ${column} DESC
    LIMIT ${query.limit} OFFSET ${query.offset}
  `;
};

export const tankPlayersSql = ({ query, minBattles }: LeaderboardSqlInput): Prisma.Sql => {
  const column = Prisma.raw(TANK_RATING_COLUMN[query.metric]);
  const type = query.type ?? null;

  return Prisma.sql`
    WITH agg AS (
      SELECT atr.account_id,
             sum(atr.battles)::float8 AS battles,
             (sum(atr.${column} * atr.battles) FILTER (WHERE atr.${column} IS NOT NULL)
               / nullif(sum(atr.battles) FILTER (WHERE atr.${column} IS NOT NULL), 0))::float8 AS value
      FROM account_tank_rating atr
      JOIN vehicle v ON v.tank_id = atr.tank_id
      WHERE atr.period = ${RATING_PERIOD_SQL[query.period]}::rating_period
        AND (${query.tankId ?? null}::int IS NULL OR atr.tank_id = ${query.tankId ?? null}::int)
        AND (${query.tier ?? null}::int IS NULL OR v.tier = ${query.tier ?? null}::int)
        AND (${type}::text IS NULL OR v.type::text = ${type}::text)
      GROUP BY atr.account_id
      HAVING sum(atr.battles) >= ${minBattles}
    )
    SELECT agg.account_id AS "accountId", NULL::bigint AS "clanId", p.nickname AS name, c.tag AS "clanTag", NULL::text AS color,
           agg.value, agg.battles, NULL::float8 AS delta, count(*) OVER () AS total
    FROM agg
    JOIN player p ON p.account_id = agg.account_id AND NOT p.is_hidden
    LEFT JOIN clan c ON c.clan_id = p.clan_id
    WHERE agg.value IS NOT NULL
    ORDER BY agg.value DESC
    LIMIT ${query.limit} OFFSET ${query.offset}
  `;
};

export const clansSql = (query: LeaderboardQuery): Prisma.Sql => {
  const column = Prisma.raw(`s.${CLAN_SNAPSHOT_COLUMN[query.metric]}`);

  return Prisma.sql`
    WITH latest AS (
      SELECT DISTINCT ON (clan_id) * FROM clan_snapshot ORDER BY clan_id, captured_at DESC
    )
    SELECT NULL::bigint AS "accountId", c.clan_id AS "clanId", c.name, c.tag AS "clanTag", c.color,
           ${column}::float8 AS value, coalesce(s.battles_delta, 0)::float8 AS battles, NULL::float8 AS delta, count(*) OVER () AS total
    FROM latest s
    JOIN clan c ON c.clan_id = s.clan_id AND NOT c.is_disbanded
    WHERE ${column} IS NOT NULL
    ORDER BY ${column} DESC
    LIMIT ${query.limit} OFFSET ${query.offset}
  `;
};

export const risingStarsSql = ({ query, period, minBattles }: RisingStarsSqlInput): Prisma.Sql => {
  const column = Prisma.raw(ACCOUNT_RATING_COLUMN[query.metric]);

  return Prisma.sql`
    SELECT r.account_id AS "accountId", NULL::bigint AS "clanId", p.nickname AS name, c.tag AS "clanTag", NULL::text AS color,
           r.${column}::float8 AS value, r.battles::float8 AS battles, (r.${column} - o.${column})::float8 AS delta, count(*) OVER () AS total
    FROM account_rating r
    JOIN account_rating o ON o.account_id = r.account_id AND o.period = 'overall'::rating_period
    JOIN player p ON p.account_id = r.account_id AND NOT p.is_hidden
    LEFT JOIN clan c ON c.clan_id = p.clan_id
    WHERE r.period = ${RATING_PERIOD_SQL[period]}::rating_period AND r.battles >= ${minBattles}
      AND r.${column} IS NOT NULL AND o.${column} IS NOT NULL
    ORDER BY delta DESC
    LIMIT ${query.limit} OFFSET ${query.offset}
  `;
};

export const marksSql = (query: LeaderboardQuery): Prisma.Sql => Prisma.sql`
  SELECT pt.account_id AS "accountId", NULL::bigint AS "clanId", p.nickname AS name, c.tag AS "clanTag", NULL::text AS color,
         count(*)::float8 AS value, sum(pt.battles)::float8 AS battles, NULL::float8 AS delta, count(*) OVER () AS total
  FROM player_tank pt
  JOIN player p ON p.account_id = pt.account_id AND NOT p.is_hidden
  LEFT JOIN clan c ON c.clan_id = p.clan_id
  WHERE pt.marks_on_gun = 3
  GROUP BY pt.account_id, p.nickname, c.tag
  ORDER BY value DESC
  LIMIT ${query.limit} OFFSET ${query.offset}
`;
