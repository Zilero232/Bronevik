import { z } from 'zod';

import { accountIdSchema, countSchema, isoDateTimeSchema, tankIdSchema, uuidSchema } from '../common/primitives/primitives.schemas';
import { visibilitySchema } from '../community/community.schemas';
import { battleResultSchema } from '../sessions/sessions.schemas';

export const replayStatusSchema = z.enum(['uploaded', 'parsing', 'parsed', 'failed']);

export const replayPlayerSchema = z.object({
  accountId: accountIdSchema,
  nickname: z.string(),
  clanTag: z.string().nullable(),
  team: z.number().int().min(1).max(2),
  tankId: tankIdSchema,
  damageDealt: countSchema.nullable(),
  frags: countSchema.nullable(),
  survived: z.boolean().nullable()
});

export const replaySummarySchema = z.object({
  id: uuidSchema,
  status: replayStatusSchema,
  visibility: visibilitySchema,
  gameVersion: z.string().nullable(),
  arenaId: z.string().nullable(),
  mapName: z.string().nullable(),
  battleType: z.string().nullable(),
  playedAt: isoDateTimeSchema.nullable(),
  owner: replayPlayerSchema.nullable(),
  result: battleResultSchema.nullable(),
  damageDealt: countSchema.nullable(),
  damageAssisted: countSchema.nullable(),
  frags: countSchema.nullable(),
  xp: countSchema.nullable(),
  medals: z.array(z.string()),
  players: z.array(replayPlayerSchema),
  durationSec: countSchema.nullable(),
  views: countSchema,
  downloadUrl: z.url().nullable(),
  createdAt: isoDateTimeSchema
});
