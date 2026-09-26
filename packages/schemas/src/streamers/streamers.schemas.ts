import { z } from 'zod';

import { accountIdSchema, countSchema, isoDateTimeSchema, tankIdSchema, uuidSchema } from '../common/primitives/primitives.schemas';
import { tierSchema, vehicleTypeSchema } from '../vehicles/vehicles.schemas';
import { STREAMER_PROFILE } from './streamers.constants';

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
  isPaused: z.boolean(),
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

export const streamerProfileSchema = z.object({
  slug: z.string(),
  displayName: z.string(),
  accountId: accountIdSchema.nullable(),
  bio: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  isLive: z.boolean()
});

export const streamerSlugSchema = z.string().trim().toLowerCase().regex(STREAMER_PROFILE.slugPattern);

export const upsertStreamerProfileSchema = z.object({
  slug: streamerSlugSchema,
  displayName: z.string().trim().min(2).max(STREAMER_PROFILE.displayNameMaxLength),
  accountId: accountIdSchema.nullable().optional(),
  bio: z.string().trim().max(STREAMER_PROFILE.bioMaxLength).nullable().optional(),
  links: z.record(z.string().max(32), z.url()).nullable().optional()
});

export const createOverlaySchema = z.object({
  name: z.string().trim().min(1).max(64),
  kind: overlayKindSchema,
  accountId: accountIdSchema.optional(),
  config: overlayConfigSchema
});

export const updateOverlaySchema = createOverlaySchema.partial();

export const previewOverlaySchema = createOverlaySchema.omit({ name: true }).extend({
  name: z.string().trim().max(64).optional()
});

export const overlayListSchema = z.array(overlaySchema);

export const overlayPublicIdSchema = z.string().regex(STREAMER_PROFILE.publicIdPattern);

export const overlayResultSchema = z.enum(['win', 'loss', 'draw']);

export const overlayDataSchema = z.object({
  kind: overlayKindSchema,
  name: z.string(),
  config: overlayConfigSchema,
  isPaused: z.boolean(),
  player: z.object({ accountId: accountIdSchema, nickname: z.string() }).nullable(),
  session: z
    .object({
      battles: z.number().int().nonnegative(),
      wins: z.number().int().nonnegative(),
      winRate: z.number().min(0).max(100).nullable(),
      avgDamage: z.number().nonnegative().nullable(),
      frags: z.number().int().nonnegative(),
      wn8: z.number().nullable(),
      broneIndex: z.number().nullable(),
      winStreak: z.number().int().nonnegative(),
      lastBattle: z.object({ tankId: z.number().int(), tankName: z.string(), result: overlayResultSchema, damage: z.number().int() }).nullable()
    })
    .nullable(),
  overall: z
    .object({ battles: z.number().int(), winRate: z.number().nullable(), wn8: z.number().nullable(), broneIndex: z.number().nullable() })
    .nullable(),
  moe: z.object({ tankName: z.string(), marks: z.number().int(), percent: z.number() }).nullable(),
  challenge: z
    .object({
      title: z.string(),
      code: z.string(),
      status: challengeStatusSchema,
      battles: z.number().int(),
      battlesNeeded: z.number().int(),
      value: z.number(),
      target: z.number()
    })
    .nullable(),
  updatedAt: isoDateTimeSchema
});

export const streamerChallengeSchema = challengeSchema.extend({
  code: z.string()
});

export const challengeListSchema = z.array(streamerChallengeSchema);

export const activateChallengeSchema = z.object({
  donorName: z.string().trim().min(1).max(64).optional()
});

export const streamerProviderSchema = z.enum(['donationAlerts', 'twitch', 'vkPlayLive', 'youtube']);

export const connectableProviderSchema = z.enum(['donation-alerts', 'twitch']);

export const streamerIntegrationSchema = z.object({
  provider: streamerProviderSchema,
  externalId: z.string(),
  login: z.string().nullable(),
  connectedAt: isoDateTimeSchema
});

export const integrationListSchema = z.array(streamerIntegrationSchema);

export const connectUrlSchema = z.object({
  url: z.url()
});
