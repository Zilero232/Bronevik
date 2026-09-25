import { z } from 'zod';

export const replayGameSchema = z.enum(['lesta', 'wg', 'unknown']);

export const clientVersionSchema = z.object({
  xml: z.string().nullable(),
  exe: z.string().nullable(),
  numbers: z.tuple([z.number(), z.number(), z.number(), z.number()]).nullable(),
  label: z.string().nullable()
});

export const playerResultSchema = z.object({
  damageDealt: z.number(),
  assistRadio: z.number(),
  assistTrack: z.number(),
  assistStun: z.number(),
  blocked: z.number(),
  damageReceived: z.number(),
  spotted: z.number(),
  frags: z.number(),
  teamKills: z.number(),
  xp: z.number(),
  credits: z.number(),
  shots: z.number(),
  hits: z.number(),
  penetrations: z.number(),
  capturePoints: z.number(),
  defencePoints: z.number(),
  lifeTimeSeconds: z.number(),
  health: z.number().nullable(),
  survived: z.boolean(),
  killerVehicleId: z.number().nullable()
});

export const replayPlayerSchema = z.object({
  vehicleId: z.number().int(),
  accountId: z.number().int().nullable(),
  name: z.string(),
  clanTag: z.string().nullable(),
  team: z.number().int(),
  vehicleType: z.string().nullable(),
  tankId: z.number().int().nullable(),
  maxHealth: z.number().nullable(),
  isRecorder: z.boolean(),
  result: playerResultSchema.nullable()
});

export const replaySummarySchema = z.object({
  game: replayGameSchema,
  clientVersion: clientVersionSchema,
  region: z.string().nullable(),
  server: z.string().nullable(),
  map: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    arenaTypeId: z.number().nullable()
  }),
  mode: z.string().nullable(),
  battleType: z.number().nullable(),
  dateTime: z.string().nullable(),
  startedAt: z.string().nullable(),
  arenaCreatedAt: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  winnerTeam: z.number().nullable(),
  finishReason: z.number().nullable(),
  outcome: z.enum(['win', 'loss', 'draw']).nullable(),
  arenaUniqueId: z.string().nullable(),
  isComplete: z.boolean(),
  hasMods: z.boolean().nullable(),
  recorder: z.object({
    accountId: z.number().int().nullable(),
    name: z.string().nullable(),
    vehicleId: z.number().int().nullable(),
    vehicleType: z.string().nullable(),
    team: z.number().int().nullable()
  }),
  players: z.array(replayPlayerSchema)
});
