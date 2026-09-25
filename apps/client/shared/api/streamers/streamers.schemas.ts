import {
  accountIdSchema,
  challengeSchema,
  challengeStatusSchema,
  isoDateTimeSchema,
  overlayConfigSchema,
  overlayKindSchema,
  overlaySchema
} from '@bronevik/schemas';
import { z } from 'zod';

import { STREAMER_PROFILE } from './streamers.constants';

export const streamerProfileSchema = z.object({
  slug: z.string(),
  displayName: z.string(),
  accountId: accountIdSchema.nullable(),
  bio: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  isLive: z.boolean()
});

export const upsertStreamerProfileSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(STREAMER_PROFILE.slugPattern),
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

export const overlayListSchema = z.array(overlaySchema);

export const overlayPublicIdSchema = z.string().regex(STREAMER_PROFILE.publicIdPattern);

export const overlayResultSchema = z.enum(['win', 'loss', 'draw']);

export const overlayDataSchema = z.object({
  kind: overlayKindSchema,
  name: z.string(),
  config: overlayConfigSchema,
  player: z.object({ accountId: accountIdSchema, nickname: z.string() }).nullable(),
  session: z
    .object({
      battles: z.number().int().nonnegative(),
      wins: z.number().int().nonnegative(),
      winRate: z.number().min(0).max(100).nullable(),
      avgDamage: z.number().nonnegative().nullable(),
      frags: z.number().int().nonnegative(),
      wn8: z.number().nullable(),
      winStreak: z.number().int().nonnegative(),
      lastBattle: z.object({ tankId: z.number().int(), tankName: z.string(), result: overlayResultSchema, damage: z.number().int() }).nullable()
    })
    .nullable(),
  overall: z.object({ battles: z.number().int(), winRate: z.number().nullable(), wn8: z.number().nullable() }).nullable(),
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
