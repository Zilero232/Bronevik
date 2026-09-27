import type { ClanActivitySqlInput } from './clan-activity.types';

import { Prisma } from '../../../../../../generated';
import { RATING_PERIOD_SQL, STATS_MODE_SQL } from '../../../../../common/lib';

export const clanActivitySql = ({ clanIds, battlesSince, activeSince }: ClanActivitySqlInput): Prisma.Sql => Prisma.sql`
  SELECT cm.clan_id AS "clanId",
         (sum(latest.battles - base.battles) FILTER (WHERE latest.battles >= base.battles))::int AS "battlesDelta",
         avg(ar.wn8)::float8 AS "avgWn8",
         avg(ar.win_rate)::float8 AS "avgWinRate",
         (count(*) FILTER (WHERE p.last_battle_at >= ${activeSince}))::int AS "activeMembers7d"
  FROM clan_member cm
  JOIN player p ON p.account_id = cm.account_id
  LEFT JOIN account_rating ar ON ar.account_id = cm.account_id AND ar.period = ${RATING_PERIOD_SQL.overall}::rating_period
  LEFT JOIN LATERAL (
    SELECT battles FROM account_snapshot
    WHERE account_id = cm.account_id AND mode = ${STATS_MODE_SQL.all}::stats_mode
    ORDER BY captured_at DESC
    LIMIT 1
  ) latest ON true
  LEFT JOIN LATERAL (
    SELECT battles FROM account_snapshot
    WHERE account_id = cm.account_id AND mode = ${STATS_MODE_SQL.all}::stats_mode AND captured_at <= ${battlesSince}
    ORDER BY captured_at DESC
    LIMIT 1
  ) base ON true
  WHERE cm.clan_id IN (${Prisma.join(clanIds)})
  GROUP BY cm.clan_id
`;
