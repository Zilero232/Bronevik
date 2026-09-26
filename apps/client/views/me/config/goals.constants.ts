import type { GoalMetric } from '@bronevik/schemas';

export const GOAL_METRICS = {
  percent: new Set<GoalMetric>(['winRate', 'moe']),
  percentMax: 100
} as const;

export const GOAL_STATUS_TONE = {
  achieved: 'success',
  active: 'steel',
  failed: 'danger',
  cancelled: 'neutral'
} as const;
