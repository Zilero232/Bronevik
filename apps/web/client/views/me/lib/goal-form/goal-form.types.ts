import type { z } from 'zod';

import type { goalFormSchema } from './goal-form';

export type GoalFormValues = z.input<typeof goalFormSchema>;

export type GoalFormOutput = z.output<typeof goalFormSchema>;

export type GoalDuration = GoalFormOutput['duration'];

export type ToGoalInputInput = {
  values: GoalFormOutput;
  accountId: number;
  now: Date;
};
