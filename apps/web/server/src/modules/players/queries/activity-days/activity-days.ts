import type { ActivityDaysSqlInput } from './activity-days.types';

import { Prisma } from '../../../../../generated';
import { TIME } from '../../../../config';
import { PLAYER_STATS } from '../../config';

export const activityDaysSql = ({ accountId, from }: ActivityDaysSqlInput) => Prisma.sql`
  SELECT to_char(captured_at AT TIME ZONE ${TIME.zone}, 'YYYY-MM-DD') AS day,
         sum(battles)::float8 AS battles,
         sum(wins)::float8 AS wins
  FROM tank_battle_delta
  WHERE account_id = ${accountId} AND mode = ${PLAYER_STATS.snapshotMode}::stats_mode AND captured_at >= ${from}
  GROUP BY 1
  ORDER BY 1
`;
