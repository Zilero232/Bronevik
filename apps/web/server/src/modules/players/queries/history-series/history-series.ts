import type { HistorySeriesSqlInput } from './history-series.types';

import { Prisma } from '../../../../../generated';
import { TIME } from '../../../../config';
import { PLAYER_STATS } from '../../config';

export const historySeriesSql = ({ accountId, granularity, from, to }: HistorySeriesSqlInput) => Prisma.sql`
  SELECT (date_trunc(${granularity}, captured_at AT TIME ZONE ${TIME.zone}) AT TIME ZONE ${TIME.zone}) AS bucket,
         tank_id,
         sum(battles)::float8 AS battles,
         sum(wins)::float8 AS wins,
         sum(damage_dealt)::float8 AS damage,
         sum(frags)::float8 AS frags,
         sum(spotted)::float8 AS spotted,
         sum(dropped_capture_points)::float8 AS def,
         sum(capture_points)::float8 AS cap
  FROM tank_battle_delta
  WHERE account_id = ${accountId} AND mode = ${PLAYER_STATS.snapshotMode}::stats_mode AND captured_at >= ${from} AND captured_at < ${to}
  GROUP BY 1, 2
`;
