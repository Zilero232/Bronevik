import type { SnapshotEventsSqlInput } from './tank-events.types';

import { Prisma } from '../../../../../generated';

export const tankEventsSql = ({ accountIds, lookback, since, until, aceMastery }: SnapshotEventsSqlInput): Prisma.Sql => Prisma.sql`
  SELECT account_id, tank_id, captured_at, marks_on_gun, prev_marks, mark_of_mastery, prev_mastery
  FROM (
    SELECT account_id, tank_id, captured_at, marks_on_gun, mark_of_mastery,
      LAG(marks_on_gun) OVER w AS prev_marks,
      LAG(mark_of_mastery) OVER w AS prev_mastery
    FROM tank_snapshot
    WHERE account_id = ANY(${[...accountIds]}::bigint[])
      AND mode = 'all'::stats_mode
      AND captured_at >= ${lookback}
      AND captured_at < ${until}
    WINDOW w AS (PARTITION BY account_id, tank_id ORDER BY captured_at)
  ) events
  WHERE captured_at >= ${since}
    AND ((marks_on_gun > prev_marks) OR (mark_of_mastery = ${aceMastery} AND prev_mastery < ${aceMastery}))
  ORDER BY captured_at DESC
`;
