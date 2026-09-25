import { z } from 'zod';

import { countSchema, percentSchema } from '../common/primitives/primitives.schemas';

const pointSchema = z.tuple([z.number(), z.number()]);

export const mapsQuerySchema = z.object({
  mode: z.string().trim().min(1).max(32).optional(),
  search: z.string().trim().min(1).max(64).optional()
});

export const mapParamsSchema = z.object({
  idOrSlug: z.string().trim().min(1).max(64)
});

export const mapSummarySchema = z.object({
  arenaId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.url().nullable(),
  sizeMeters: countSchema.nullable(),
  camouflage: z.string().nullable(),
  modes: z.array(z.string())
});

export const mapModeSchema = z.object({
  mode: z.string(),
  minimap: z.url().nullable(),
  bases: z.record(z.string(), z.array(pointSchema)),
  spawns: z.record(z.string(), z.array(pointSchema)),
  controlPoints: z.array(pointSchema)
});

export const mapTeamStatsSchema = z.object({
  team: z.number().int().positive(),
  battles: countSchema,
  winRate: percentSchema.nullable()
});

export const mapStatsSchema = z
  .object({
    source: z.enum(['battles', 'replays']),
    battles: countSchema,
    teams: z.array(mapTeamStatsSchema)
  })
  .describe('Win rate by team (spawn side) from mod battles, or from uploaded replays when there are no mod battles');

export const mapDetailSchema = mapSummarySchema.extend({
  description: z.string().nullable(),
  boundingBox: z.object({ bottomLeft: pointSchema, upperRight: pointSchema }).nullable(),
  maxPlayersInTeam: countSchema.nullable(),
  roundLengthSec: countSchema.nullable(),
  gameModes: z.array(mapModeSchema),
  stats: mapStatsSchema.nullable()
});

export const mapListSchema = z.array(mapSummarySchema);
