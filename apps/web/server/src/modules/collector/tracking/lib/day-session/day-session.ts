import { accountWn8 } from '@otmetki/ratings';
import { firstBy, groupBy, sumBy } from 'remeda';

import type { BuildDaySessionInput, DaySession, TotalInput } from './day-session.types';

const total = ({ rows, field }: TotalInput): number => sumBy(rows, (row) => row[field]);

export const buildDaySession = ({ accountId, day, deltas, expected }: BuildDaySessionInput): DaySession | null => {
  const first = firstBy(deltas, (row) => row.capturedAt.getTime());
  const last = firstBy(deltas, [(row) => row.capturedAt.getTime(), 'desc']);

  if (!first || !last) {
    return null;
  }

  const tanks = Object.values(groupBy(deltas, (row) => row.tankId)).map((rows) => ({
    tankId: rows[0].tankId,
    battles: total({ rows, field: 'battles' }),
    wins: total({ rows, field: 'wins' }),
    damageDealt: total({ rows, field: 'damageDealt' }),
    frags: total({ rows, field: 'frags' }),
    spotted: total({ rows, field: 'spotted' }),
    capturePoints: total({ rows, field: 'capturePoints' }),
    droppedCapturePoints: total({ rows, field: 'droppedCapturePoints' })
  }));

  return {
    accountId,
    source: 'api',
    kind: 'day',
    status: 'closed',
    day,
    startedAt: first.capturedAt,
    endedAt: last.capturedAt,
    lastActivityAt: last.capturedAt,
    startCapturedAt: first.capturedAt,
    endCapturedAt: last.capturedAt,
    battles: total({ rows: deltas, field: 'battles' }),
    wins: total({ rows: deltas, field: 'wins' }),
    damageDealt: total({ rows: deltas, field: 'damageDealt' }),
    damageBlocked: total({ rows: deltas, field: 'damageBlocked' }),
    frags: total({ rows: deltas, field: 'frags' }),
    spotted: total({ rows: deltas, field: 'spotted' }),
    xp: total({ rows: deltas, field: 'xp' }),
    survived: total({ rows: deltas, field: 'survived' }),
    wn8: accountWn8({ tanks, expected }).wn8
  };
};
