import type { GoalMetric } from '@bronevik/schemas';

export const GOAL_METRICS = {
  percent: new Set<GoalMetric>(['winRate', 'moe']),
  percentMax: 100
} as const;
