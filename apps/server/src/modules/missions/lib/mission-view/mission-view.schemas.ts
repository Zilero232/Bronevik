import { z } from 'zod';

export const storedConditionSchema = z.object({
  progressId: z.string(),
  isMain: z.boolean(),
  isAward: z.boolean(),
  display: z.string().nullable(),
  icon: z.string().nullable(),
  goal: z.number().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable()
});

export const storedConditionsSchema = z.array(storedConditionSchema);
