import type { PlaytimeSqlInput } from './playtime.types';

import { Prisma } from '../../../../../generated';
import { TIME } from '../../../../config';
import { PLAYER_STATS } from '../../config';

export const playtimeFromBattlesSql = ({ accountId, from }: PlaytimeSqlInput) => Prisma.sql`
  SELECT (extract(isodow FROM started_at AT TIME ZONE ${TIME.zone}) - 1)::int AS weekday,
         extract(hour FROM started_at AT TIME ZONE ${TIME.zone})::int AS hour,
         count(*)::float8 AS battles,
         count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
         sum(damage_dealt)::float8 AS damage
  FROM battle
  WHERE account_id = ${accountId} AND started_at >= ${from}
  GROUP BY 1, 2
`;

export const playtimeFromSnapshotsSql = ({ accountId, from }: PlaytimeSqlInput) => Prisma.sql`
  SELECT (extract(isodow FROM captured_at AT TIME ZONE ${TIME.zone}) - 1)::int AS weekday,
         extract(hour FROM captured_at AT TIME ZONE ${TIME.zone})::int AS hour,
         sum(battles)::float8 AS battles,
         sum(wins)::float8 AS wins,
         sum(damage_dealt)::float8 AS damage
  FROM tank_battle_delta
  WHERE account_id = ${accountId} AND mode = ${PLAYER_STATS.snapshotMode}::stats_mode AND captured_at >= ${from}
  GROUP BY 1, 2
`;
