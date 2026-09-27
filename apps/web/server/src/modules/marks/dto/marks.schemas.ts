import { tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const moeHistoryParamsSchema = z.object({
  tankId: tankIdSchema
});

export const modMoeParamsSchema = z.object({
  tankId: tankIdSchema
});

export const modMoeThresholdsSchema = z.object({
  tank_id: z.number().int().positive(),
  thresholds: z.record(z.string().regex(/^\d{1,3}(\.\d+)?$/), z.number().nonnegative()),
  updated_at: z.string(),
  source: z.string()
});
