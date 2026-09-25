import {
  accountIdSchema,
  challengeSchema,
  challengeStatusSchema,
  isoDateTimeSchema,
  overlayConfigSchema,
  overlayKindSchema,
  overlaySchema,
  uuidSchema
} from '@bronevik/schemas';
import { z } from 'zod';

import { StreamerProvider } from '../../../../generated';
import { STREAMER_PROFILE } from '../config';

export const streamerProfileSchema = z.object({
  slug: z.string(),
  displayName: z.string(),
  accountId: accountIdSchema.nullable(),
  bio: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  isLive: z.boolean()
});

export const upsertProfileSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(STREAMER_PROFILE.slugPattern),
  displayName: z.string().trim().min(2).max(STREAMER_PROFILE.displayNameMaxLength),
  accountId: accountIdSchema.nullable().optional(),
  bio: z.string().trim().max(STREAMER_PROFILE.bioMaxLength).nullable().optional(),
  links: z.record(z.string().max(32), z.url()).nullable().optional()
});

export const slugParamsSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(STREAMER_PROFILE.slugPattern)
});

export const createOverlaySchema = z.object({
  name: z.string().trim().min(1).max(64),
  kind: overlayKindSchema,
  accountId: accountIdSchema.optional(),
  config: overlayConfigSchema
});

export const updateOverlaySchema = createOverlaySchema.partial();

export const overlayListSchema = z.array(overlaySchema);

export const idParamsSchema = z.object({
  id: uuidSchema
});

export const overlayParamsSchema = z.object({
  publicId: z.string().regex(/^[\da-f]{32}$/u)
});

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
      lastBattle: z
        .object({ tankId: z.number().int(), tankName: z.string(), result: z.enum(['win', 'loss', 'draw']), damage: z.number().int() })
        .nullable()
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

export const streamerIntegrationSchema = z.object({
  provider: z.enum(['donationAlerts', 'twitch', 'vkPlayLive', 'youtube']),
  externalId: z.string(),
  login: z.string().nullable(),
  connectedAt: isoDateTimeSchema
});

export const integrationListSchema = z.array(streamerIntegrationSchema);

export const connectProviderSchema = z.object({
  provider: z.enum(['donation-alerts', 'twitch'])
});

export const connectUrlSchema = z.object({
  url: z.url()
});

export const oauthCallbackSchema = z.object({
  code: z.string().min(1).max(2048),
  state: z.string().min(1).max(256)
});

export const oauthStateSchema = z
  .string()
  .transform((raw, context) => {
    try {
      const value: unknown = JSON.parse(raw);

      return value;
    } catch {
      context.addIssue({ code: 'custom', message: 'The OAuth state is not JSON' });

      return z.NEVER;
    }
  })
  .pipe(z.object({ provider: z.enum(StreamerProvider), userId: z.string().min(1) }));
