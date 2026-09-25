import type { GoalMetric } from '@bronevik/schemas';

import { createGoalSchema } from '@bronevik/schemas';
import { z } from 'zod';

import { GOAL_METRICS } from '../../config';

export const isPercentMetric = (metric: GoalMetric) => GOAL_METRICS.percent.has(metric);

export const goalFormSchema = createGoalSchema
  .extend({ target: z.coerce.number().positive() })
  .refine(({ metric, target }) => !isPercentMetric(metric) || target <= GOAL_METRICS.percentMax, { path: ['target'] });
