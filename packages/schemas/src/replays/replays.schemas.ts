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
  survived: z.boolean().nullable(),
  vehicleId: z.number().int().nullable(),
  vehicleType: z.string().nullable(),
  maxHealth: countSchema.nullable(),
  isRecorder: z.boolean().nullable(),
  damageAssisted: countSchema.nullable(),
  assistRadio: countSchema.nullable(),
  assistTrack: countSchema.nullable(),
  assistStun: countSchema.nullable(),
  damageBlocked: countSchema.nullable(),
  damageReceived: countSchema.nullable(),
  spotted: countSchema.nullable(),
  xp: countSchema.nullable(),
  shots: countSchema.nullable(),
  hits: countSchema.nullable(),
  penetrations: countSchema.nullable(),
  lifeTimeSec: countSchema.nullable(),
  killerVehicleId: z.number().int().nullable()
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
  isOwner: z.boolean(),
  downloadUrl: z.url().nullable(),
  createdAt: isoDateTimeSchema
});
