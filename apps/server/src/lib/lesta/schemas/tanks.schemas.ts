import { z } from 'zod';

import { battleStatsBlockSchema } from './statistics.schemas';

const optionalBlock = battleStatsBlockSchema.optional();

export const tankStatsSchema = z.looseObject({
  tank_id: z.number(),
  account_id: z.number(),
  mark_of_mastery: z.number(),
  max_frags: z.number().optional(),
  max_xp: z.number().optional(),
  in_garage: z.boolean().nullish(),
  frags: z.record(z.string(), z.number()).nullish(),
  all: battleStatsBlockSchema,
  random: optionalBlock,
  clan: optionalBlock,
  company: optionalBlock,
  team: optionalBlock,
  regular_team: optionalBlock,
  stronghold_skirmish: optionalBlock,
  stronghold_defense: optionalBlock,
  globalmap: optionalBlock,
  epic: optionalBlock
});

export const tankAchievementsSchema = z.looseObject({
  tank_id: z.number(),
  account_id: z.number(),
  achievements: z.record(z.string(), z.number()),
  series: z.record(z.string(), z.number().nullable()).nullish(),
  max_series: z.record(z.string(), z.number()).nullish()
});

export const tankMasterySchema = z.looseObject({
  distribution: z.record(z.string(), z.record(z.string(), z.number())).optional()
});
