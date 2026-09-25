import type { GoalMetric } from '@bronevik/schemas';

export type MockGoalSeed = {
  metric: GoalMetric;
  target: number;
  baseline: number;
  current: number;
};
