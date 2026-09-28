import type { ModGoal } from '@otmetki/schemas';

import type { ToModGoalInput } from './mod-goal.types';

import { toIso } from '../../../../common/lib';

export const toModGoal = ({ row, battles }: ToModGoalInput): ModGoal => ({
  id: row.id,
  metric: row.metric,
  tank_id: row.tankId,
  target: row.target,
  baseline: row.baseline,
  current: row.current,
  battles,
  status: row.status,
  starts_at: row.startsAt.toISOString(),
  ends_at: row.endsAt.toISOString(),
  achieved_at: toIso(row.achievedAt)
});
