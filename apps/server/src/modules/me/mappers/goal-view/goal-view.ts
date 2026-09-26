import type { Goal as GoalRow } from '../../../../../generated';
import type { Goal } from '../../me.types';

import { toIso, toNumber } from '../../../../common/lib';

export const toGoal = (row: GoalRow): Goal => ({
  id: row.id,
  accountId: toNumber(row.accountId),
  metric: row.metric,
  tankId: row.tankId,
  target: row.target,
  baseline: row.baseline,
  current: row.current,
  status: row.status,
  startsAt: row.startsAt.toISOString(),
  endsAt: row.endsAt.toISOString(),
  achievedAt: toIso(row.achievedAt),
  createdAt: row.createdAt.toISOString()
});
