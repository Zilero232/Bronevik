import { accountWn8 } from '@otmetki/ratings';
import { firstBy, groupBy, sumBy } from 'remeda';

import type { BuildDaySessionInput, DaySession, DaySessionDelta } from './day-session.types';

const total = (rows: readonly DaySessionDelta[], field: keyof Omit<DaySessionDelta, 'capturedAt' | 'tankId'>): number =>
  sumBy(rows, (row) => row[field]);

export const buildDaySession = ({ accountId, day, deltas, expected }: BuildDaySessionInput): DaySession | null => {
  const first = firstBy(deltas, (row) => row.capturedAt.getTime());
  const last = firstBy(deltas, [(row) => row.capturedAt.getTime(), 'desc']);

  if (!first || !last) {
    return null;
  }

  const tanks = Object.values(groupBy(deltas, (row) => row.tankId)).map((rows) => ({
    tankId: rows[0].tankId,
    battles: total(rows, 'battles'),
    wins: total(rows, 'wins'),
    damageDealt: total(rows, 'damageDealt'),
    frags: total(rows, 'frags'),
    spotted: total(rows, 'spotted'),
    capturePoints: total(rows, 'capturePoints'),
    droppedCapturePoints: total(rows, 'droppedCapturePoints')
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
    battles: total(deltas, 'battles'),
    wins: total(deltas, 'wins'),
    damageDealt: total(deltas, 'damageDealt'),
    damageBlocked: total(deltas, 'damageBlocked'),
    frags: total(deltas, 'frags'),
    spotted: total(deltas, 'spotted'),
    xp: total(deltas, 'xp'),
    survived: total(deltas, 'survived'),
    wn8: accountWn8({ tanks, expected }).wn8
  };
};
