import { z } from 'zod';

import { battleStatsBlockSchema, modeStatsBlockSchema } from '../statistics/statistics.schemas';

export const tankStatsSchema = z.looseObject({
  tank_id: z.number(),
  account_id: z.number(),
  mark_of_mastery: z.number(),
  max_frags: z.number().optional(),
  max_xp: z.number().optional(),
  in_garage: z.boolean().nullish(),
  frags: z.record(z.string(), z.number()).nullish(),
  all: battleStatsBlockSchema,
  random: battleStatsBlockSchema.optional(),
  clan: modeStatsBlockSchema,
  company: modeStatsBlockSchema,
  team: modeStatsBlockSchema,
  regular_team: modeStatsBlockSchema,
  stronghold_skirmish: modeStatsBlockSchema,
  stronghold_defense: modeStatsBlockSchema,
  globalmap: modeStatsBlockSchema,
  epic: modeStatsBlockSchema,
  ranked_battles: modeStatsBlockSchema
});

export const tankGarageSchema = z.looseObject({
  tank_id: z.number(),
  in_garage: z.boolean().nullish()
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
