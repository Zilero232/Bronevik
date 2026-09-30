import { moeCurvePointSchema, tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const moeHistoryParamsSchema = z.object({
  tankId: tankIdSchema
});

export const modMoeParamsSchema = z.object({
  tankId: tankIdSchema
});

export const modMoeThresholdsSchema = z.object({
  tank_id: z.number().int().positive(),
  is_enough: z.boolean().describe('Whether the 65/85/95 % thresholds are known; when false `thresholds` is empty and only `curve` carries data'),
  thresholds: z.record(z.string().regex(/^\d{1,3}(\.\d+)?$/), z.number().nonnegative()),
  curve: z.array(moeCurvePointSchema).describe('The percents the mod players reported enough over the last window, for interpolation'),
  mastery: z
    .object({
      class3: z.number().nonnegative(),
      class2: z.number().nonnegative(),
      class1: z.number().nonnegative(),
      ace: z.number().nonnegative()
    })
    .optional(),
  updated_at: z.string().nullable(),
  source: z.string().nullable()
});
