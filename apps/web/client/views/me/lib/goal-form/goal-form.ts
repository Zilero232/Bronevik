import type { GoalMetric } from '@otmetki/schemas';

import { createGoalSchema } from '@otmetki/schemas';
import { addDays } from 'date-fns';
import { z } from 'zod';

import type { ToGoalInputInput } from './goal-form.types';

import { GOAL_FORM, GOAL_METRICS } from '../../config';

export const isPercentMetric = (metric: GoalMetric) => GOAL_METRICS.percent.has(metric);

export const goalFormSchema = createGoalSchema
  .pick({ metric: true })
  .extend({ target: z.coerce.number().positive(), duration: z.enum(GOAL_FORM.durations) })
  .refine(({ metric, target }) => !isPercentMetric(metric) || target <= GOAL_METRICS.percentMax, { path: ['target'] });

export const toGoalInput = ({ values: { metric, target, duration }, accountId, now }: ToGoalInputInput) => ({
  accountId,
  metric,
  target,
  endsAt: addDays(now, Number(duration)).toISOString()
});
