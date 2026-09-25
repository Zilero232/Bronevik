import { z } from 'zod';

import { accountIdSchema, isoDateTimeSchema, tankIdSchema, uuidSchema } from '../common/primitives/primitives.schemas';
import { FAVORITE } from './me.constants';

export const favoriteKindSchema = z.enum(['player', 'clan', 'tank']);

export const favoriteSchema = z.object({
  id: uuidSchema,
  kind: favoriteKindSchema,
  targetId: z.number().int().positive(),
  label: z.string().nullable(),
  isOwn: z.boolean(),
  title: z.string().nullable(),
  createdAt: isoDateTimeSchema
});

export const favoritesSchema = z.array(favoriteSchema);

export const createFavoriteSchema = z.object({
  kind: favoriteKindSchema,
  targetId: z.coerce.number().int().positive(),
  label: z.string().trim().max(FAVORITE.labelMaxLength).optional(),
  isOwn: z.boolean().optional()
});

export const goalMetricSchema = z.enum(['winRate', 'wn8', 'avgDamage', 'battles', 'moe', 'broneIndex']);

export const goalStatusSchema = z.enum(['active', 'achieved', 'failed', 'cancelled']);

export const goalSchema = z.object({
  id: uuidSchema,
  accountId: accountIdSchema,
  metric: goalMetricSchema.describe('winRate and moe are percents'),
  tankId: tankIdSchema.nullable(),
  target: z.number(),
  baseline: z.number(),
  current: z.number().nullable(),
  status: goalStatusSchema,
  startsAt: isoDateTimeSchema,
  endsAt: isoDateTimeSchema,
  achievedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema
});

export const goalsSchema = z.array(goalSchema);

export const createGoalSchema = z.object({
  accountId: accountIdSchema,
  metric: goalMetricSchema,
  tankId: tankIdSchema.optional(),
  target: z.number().finite(),
  endsAt: isoDateTimeSchema
});

export const updateGoalSchema = z.object({
  target: z.number().finite().optional(),
  endsAt: isoDateTimeSchema.optional(),
  status: z.literal('cancelled').optional()
});

export const linkedAccountsSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  lesta: z.array(
    z.object({
      accountId: accountIdSchema,
      nickname: z.string(),
      isPrimary: z.boolean(),
      linkedAt: isoDateTimeSchema,
      tokenExpiresAt: isoDateTimeSchema.nullable()
    })
  ),
  telegram: z.object({ telegramId: z.string(), username: z.string().nullable() }).nullable()
});
