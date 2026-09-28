import type { GoalMetric, GoalTankInput } from './me.types';

import { GOAL } from './me.constants';

const tankMetrics = new Set<GoalMetric>(GOAL.tankMetrics);

export const isGoalTankMetric = (metric: GoalMetric): boolean => tankMetrics.has(metric);

export const hasGoalTank = ({ metric, tankId }: GoalTankInput): boolean => !isGoalTankMetric(metric) || tankId !== undefined;
