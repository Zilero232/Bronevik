import type { RecordEventsSqlInput } from './record-events.types';

import { Prisma } from '../../../../../generated';

export const recordEventsSql = ({ accountIds, lookback, since, until }: RecordEventsSqlInput): Prisma.Sql => Prisma.sql`
  SELECT account_id, captured_at, max_damage, prev_max_damage, max_damage_tank_id
  FROM (
    SELECT account_id, captured_at, max_damage, max_damage_tank_id,
      LAG(max_damage) OVER (PARTITION BY account_id ORDER BY captured_at) AS prev_max_damage
    FROM account_snapshot
    WHERE account_id = ANY(${[...accountIds]}::bigint[])
      AND mode = 'all'::stats_mode
      AND captured_at >= ${lookback}
      AND captured_at < ${until}
  ) records
  WHERE captured_at >= ${since} AND max_damage > prev_max_damage
  ORDER BY captured_at DESC
`;
