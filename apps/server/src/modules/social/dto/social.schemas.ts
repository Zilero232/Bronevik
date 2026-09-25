import { accountIdSchema, countSchema, isoDateSchema, isoDateTimeSchema, nicknameSchema, tankIdSchema, uuidSchema } from '@bronevik/schemas';
import { z } from 'zod';

import { LEAGUE, WRAPPED } from '../config';

export const followKindSchema = z.enum(['player', 'clan', 'tank']);

export const followSchema = z.object({
  id: uuidSchema,
  kind: followKindSchema,
  targetId: z.number().int().positive(),
  label: z.string().nullable(),
  createdAt: isoDateTimeSchema
});

export const followListSchema = z.array(followSchema);

export const createFollowSchema = z.object({
  kind: followKindSchema,
  targetId: z.number().int().positive()
});

export const followParamsSchema = z.object({ id: uuidSchema });

export const feedItemSchema = z.object({
  kind: z.enum(['mark', 'mastery', 'record', 'badge']),
  accountId: accountIdSchema,
  nickname: z.string().nullable(),
  tankId: tankIdSchema.nullable(),
  value: z.number(),
  previous: z.number().nullable(),
  badgeCode: z.string().nullable(),
  at: isoDateTimeSchema
});

export const feedSchema = z.object({ items: z.array(feedItemSchema) });

export const feedQuerySchema = z.object({ days: z.coerce.number().int().min(1).max(60).optional() });

export const leagueMetricSchema = z.enum(LEAGUE.metrics);

export const leagueQuerySchema = z.object({
  metric: leagueMetricSchema.default('damage'),
  week: isoDateSchema.optional()
});

export const leagueSchema = z.object({
  metric: leagueMetricSchema,
  weekStart: isoDateSchema,
  entries: z.array(
    z.object({
      rank: z.number().int().positive(),
      accountId: accountIdSchema,
      nickname: z.string().nullable(),
      isMe: z.boolean(),
      battles: countSchema,
      value: z.number().nullable()
    })
  )
});

export const challengeSchema = z.object({
  code: z.string(),
  metric: z.string(),
  target: z.number(),
  threshold: z.number().nullable(),
  vehicleType: z.string().nullable(),
  badgeCode: z.string(),
  progress: z.array(z.object({ accountId: accountIdSchema, value: z.number(), completedAt: isoDateTimeSchema.nullable() }))
});

export const challengesSchema = z.object({
  weekStart: isoDateSchema,
  endsAt: isoDateTimeSchema,
  challenges: z.array(challengeSchema)
});

export const signatureParamsSchema = z.object({
  file: z
    .string()
    .regex(/^\w{2,24}\.png$/i)
    .transform((file) => file.slice(0, -4))
    .pipe(nicknameSchema)
});

export const wrappedParamsSchema = z.object({ id: accountIdSchema });

export const wrappedQuerySchema = z.object({
  year: z.coerce.number().int().min(WRAPPED.minYear).max(2100).optional()
});

export const wrappedSchema = z.object({
  accountId: accountIdSchema,
  nickname: z.string().nullable(),
  year: z.number().int(),
  battles: countSchema,
  wins: countSchema,
  winRate: z.number().min(0).max(1).nullable(),
  damageDealt: countSchema,
  avgDamage: z.number().nullable(),
  frags: countSchema,
  topTanks: z.array(z.object({ tankId: tankIdSchema, battles: countSchema, damageDealt: countSchema })),
  marksGained: countSchema,
  masteriesGained: countSchema,
  badges: z.array(z.string()),
  sessions: countSchema,
  busiestMonth: z.number().int().min(1).max(12).nullable(),
  bestBattle: z
    .object({ tankId: tankIdSchema, damageDealt: countSchema, frags: countSchema, at: isoDateTimeSchema, replayId: uuidSchema.nullable() })
    .nullable()
});
