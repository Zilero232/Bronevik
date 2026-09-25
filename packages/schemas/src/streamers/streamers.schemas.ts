import { z } from 'zod';

import { accountIdSchema, countSchema, isoDateTimeSchema, tankIdSchema, uuidSchema } from '../common/primitives/primitives.schemas';
import { tierSchema, vehicleTypeSchema } from '../vehicles/vehicles.schemas';

export const overlayKindSchema = z.enum(['session', 'wn8', 'moe', 'damage', 'win_rate', 'win_streak', 'challenge', 'custom']);

export const overlayMetricSchema = z.enum(['battles', 'winRate', 'avgDamage', 'wn8', 'broneIndex', 'moePercent', 'winStreak', 'frags', 'lastBattle']);

export const overlayConfigSchema = z.object({
  theme: z.enum(['steel', 'tracer', 'minimal', 'transparent']).default('steel'),
  layout: z.enum(['row', 'column', 'grid']).default('row'),
  metrics: z.array(overlayMetricSchema).min(1).max(8),
  accentColor: z
    .string()
    .regex(/^#[\da-f]{6}$/i)
    .optional(),
  fontScale: z.number().min(0.5).max(3).default(1),
  animate: z.boolean().default(true),
  showTank: z.boolean().default(true),
  resetAt: z.enum(['session', 'day', 'manual']).default('session'),
  locale: z.enum(['ru', 'en']).default('ru')
});

export const overlaySchema = z.object({
  id: uuidSchema,
  name: z.string(),
  kind: overlayKindSchema,
  accountId: accountIdSchema.nullable(),
  config: overlayConfigSchema,
  publicUrl: z.url(),
  isPro: z.boolean(),
  updatedAt: isoDateTimeSchema
});

export const challengeMetricSchema = z.enum(['damage', 'assist', 'blocked', 'frags', 'spotted', 'xp', 'win', 'survive', 'moePercent']);

export const challengeConditionSchema = z.object({
  metric: challengeMetricSchema,
  operator: z.enum(['gte', 'lte', 'eq']).default('gte'),
  value: z.number().nonnegative(),
  battles: z.number().int().min(1).max(20).default(1),
  aggregate: z.enum(['single', 'sum', 'avg']).default('single'),
  tankId: tankIdSchema.optional(),
  tankType: vehicleTypeSchema.optional(),
  minTier: tierSchema.optional()
});

export const challengeStatusSchema = z.enum(['pending', 'active', 'succeeded', 'failed', 'cancelled', 'expired', 'refunded']);

export const challengeSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  condition: challengeConditionSchema,
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: challengeStatusSchema,
  donorName: z.string().nullable(),
  progress: z.object({ battles: countSchema, value: z.number() }).nullable(),
  createdAt: isoDateTimeSchema,
  expiresAt: isoDateTimeSchema.nullable(),
  resolvedAt: isoDateTimeSchema.nullable()
});

export const createChallengeSchema = z.object({
  title: z.string().trim().min(3).max(120),
  condition: challengeConditionSchema,
  amount: z.number().positive(),
  expiresInMinutes: z
    .number()
    .int()
    .min(5)
    .max(24 * 60)
    .default(120)
});
