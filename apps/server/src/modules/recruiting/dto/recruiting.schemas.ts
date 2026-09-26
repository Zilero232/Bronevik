import { accountIdSchema, clanIdSchema, isoDateTimeSchema, paginatedSchema, paginationQuerySchema, uuidSchema } from '@bronevik/schemas';
import { z } from 'zod';

import { playerStatsSchema, postStatusSchema, statRequirementsSchema } from '../../community-core';
import { RECRUITING } from '../config';

const recruitingKindSchema = z.enum(['clan_seeks_player', 'player_seeks_clan']);

export const recruitingPostSchema = z.object({
  id: uuidSchema,
  kind: recruitingKindSchema,
  clanId: clanIdSchema.nullable(),
  clanTag: z.string().nullable(),
  accountId: accountIdSchema.nullable(),
  nickname: z.string().nullable(),
  title: z.string(),
  body: z.string(),
  requirements: statRequirementsSchema,
  stats: playerStatsSchema.nullable(),
  status: postStatusSchema,
  expiresAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema
});

export const recruitingQuerySchema = paginationQuerySchema.extend({
  kind: recruitingKindSchema.optional(),
  clanId: clanIdSchema.optional()
});

export const recruitingPageSchema = paginatedSchema(recruitingPostSchema);

export const createRecruitingSchema = z.object({
  kind: recruitingKindSchema,
  clanId: clanIdSchema.optional(),
  accountId: accountIdSchema.optional(),
  title: z.string().trim().min(5).max(140),
  body: z.string().trim().min(10).max(4000),
  requirements: statRequirementsSchema.default({}),
  expiresInDays: z.number().int().min(1).max(RECRUITING.maxDays).default(RECRUITING.defaultDays)
});
