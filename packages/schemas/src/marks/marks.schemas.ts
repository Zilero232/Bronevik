import { z } from 'zod';

import { countSchema, isoDateSchema, isoDateTimeSchema, percentSchema, tankIdSchema } from '../common/primitives/primitives.schemas';
import { listParam, paginatedSchema, paginationQuerySchema, sortQuery } from '../common/query/query.schemas';
import { vehicleFilterSchema, vehicleSummarySchema } from '../vehicles/vehicles.schemas';
import { MOE_HISTORY, SWEAT_LEVELS } from './marks.constants';

export const thresholdSourceSchema = z.enum(['otmetki', 'poliroid', 'kttc', 'lesta', 'manual']);

const damage = countSchema;

export const moeThresholdSchema = z
  .object({
    tankId: tankIdSchema,
    date: isoDateSchema,
    source: thresholdSourceSchema,
    p65: damage,
    p85: damage,
    p95: damage,
    p100: damage.nullable()
  })
  .refine(({ p65, p85, p95, p100 }) => p65 <= p85 && p85 <= p95 && (p100 === null || p95 <= p100), {
    message: 'Thresholds must not decrease from 65% to 100%'
  });

export const masteryThresholdSchema = z
  .object({
    tankId: tankIdSchema,
    date: isoDateSchema,
    source: thresholdSourceSchema,
    class3: damage,
    class2: damage,
    class1: damage,
    master: damage
  })
  .refine(({ class3, class2, class1, master }) => class3 <= class2 && class2 <= class1 && class1 <= master, {
    message: 'Mastery thresholds must not decrease from class 3 to Ace'
  });

export const thresholdTrendSchema = z.object({
  p95Delta7d: z.number().int().nullable(),
  p95Delta30d: z.number().int().nullable()
});

export const sweatLevelSchema = z.enum(SWEAT_LEVELS);

export const sweatIndexSchema = z.object({
  moe: z.number().positive().nullable().describe('95% threshold divided by the average-cohort mean damage on the tank'),
  moeLevel: sweatLevelSchema.nullable(),
  mastery: z.number().positive().nullable().describe('Ace Tanker threshold divided by the average-cohort mean XP on the tank'),
  masteryLevel: sweatLevelSchema.nullable()
});

export const moeRowSchema = z.object({
  vehicle: vehicleSummarySchema,
  moe: moeThresholdSchema.nullable(),
  mastery: masteryThresholdSchema.nullable(),
  trend: thresholdTrendSchema,
  sweat: sweatIndexSchema,
  updatedAt: isoDateTimeSchema.nullable()
});

export const moeSortFieldSchema = z.enum(['p65', 'p85', 'p95', 'p100', 'master', 'tier', 'p95Delta30d', 'p95Change30d', 'sweat', 'masterySweat']);

export const moeQuerySchema = z.object({
  ...vehicleFilterSchema.shape,
  ...sortQuery(moeSortFieldSchema).shape,
  ...paginationQuerySchema.shape,
  source: thresholdSourceSchema.optional(),
  search: z.string().trim().min(1).max(64).optional().describe('Case-insensitive match on the tank name or short name')
});

export const moePageSchema = paginatedSchema(moeRowSchema);

export const moeHistorySchema = z.array(moeThresholdSchema);

export const moeHistoryFiltersSchema = z.object({
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
  source: thresholdSourceSchema.optional()
});

export const moeHistoryQuerySchema = z.object({
  tankId: tankIdSchema,
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
  source: thresholdSourceSchema.optional()
});

export const moeProjectionSchema = z.object({
  tankId: tankIdSchema,
  currentPercent: percentSchema.nullable(),
  targetMarks: z.number().int().min(1).max(3),
  avgDamage: z.number().nonnegative(),
  battlesNeeded: countSchema.nullable()
});

export const moeHistoryBatchQuerySchema = z.object({
  tankIds: listParam(tankIdSchema).refine((ids) => ids.length >= 1 && ids.length <= MOE_HISTORY.maxBatch, {
    message: `Pass 1 to ${MOE_HISTORY.maxBatch} tank ids`
  }),
  days: z.coerce.number().int().min(1).max(MOE_HISTORY.maxDays).default(MOE_HISTORY.defaultDays),
  source: thresholdSourceSchema.optional()
});

export const moeHistoryPointSchema = z.object({
  date: isoDateSchema,
  p65: countSchema,
  p85: countSchema,
  p95: countSchema,
  p100: countSchema.nullable()
});

export const moeHistoryBatchSchema = z.object({
  days: countSchema,
  series: z.array(z.object({ tankId: tankIdSchema, points: z.array(moeHistoryPointSchema) }))
});
