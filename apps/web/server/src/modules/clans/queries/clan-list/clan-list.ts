import type { ClanListSqlInput } from './clan-list.types';

import { Prisma } from '../../../../../generated';
import { escapeLike } from '../../../../common/lib';
import { CLAN_LIST_SORT } from '../../config';

export const clanListSql = (query: ClanListSqlInput): Prisma.Sql => {
  const pattern = query.search ? `%${escapeLike(query.search)}%` : null;
  const sort = Prisma.raw(CLAN_LIST_SORT[query.sort ?? 'members']);
  const order = Prisma.raw(query.order === 'asc' ? 'ASC' : 'DESC');

  return Prisma.sql`
    SELECT c.clan_id AS "clanId", c.tag, c.name, c.color, c.motto, c.emblems, c.members_count AS "membersCount",
           c.created_at AS "createdAt", c.is_disbanded AS "isDisbanded",
           s.avg_wn8 AS "avgWn8", s.avg_win_rate AS "avgWinRate", s.active_members_7d AS "activeMembers7d",
           s.elo_rating_10 AS "eloRating10", c.stronghold_level AS "strongholdLevel", count(*) OVER () AS total
    FROM clan c
    LEFT JOIN LATERAL (
      SELECT avg_wn8, avg_win_rate, active_members_7d, elo_rating_10
      FROM clan_snapshot
      WHERE clan_id = c.clan_id
      ORDER BY captured_at DESC
      LIMIT 1
    ) s ON true
    WHERE NOT c.is_disbanded
      AND (${pattern}::text IS NULL OR c.tag ILIKE ${pattern} OR c.name ILIKE ${pattern})
      AND (${query.minMembers ?? null}::int IS NULL OR c.members_count >= ${query.minMembers ?? null}::int)
      AND (${query.minWn8 ?? null}::float8 IS NULL OR s.avg_wn8 >= ${query.minWn8 ?? null}::float8)
      AND (${query.minWinRate ?? null}::float8 IS NULL OR s.avg_win_rate >= ${query.minWinRate ?? null}::float8)
      AND (${query.minStrongholdLevel ?? null}::int IS NULL OR c.stronghold_level >= ${query.minStrongholdLevel ?? null}::int)
    ORDER BY ${sort} ${order} NULLS LAST, c.clan_id
    LIMIT ${query.limit} OFFSET ${query.offset}
  `;
};
