import { z } from 'zod';

import { battleStatsBlockSchema, modeStatsBlockSchema } from './statistics.schemas';

export const accountListItemSchema = z.looseObject({
  account_id: z.number(),
  nickname: z.string()
});

export const accountListSchema = z.array(accountListItemSchema);

export const accountStatisticsSchema = z.looseObject({
  all: battleStatsBlockSchema,
  random: battleStatsBlockSchema.optional(),
  clan: modeStatsBlockSchema,
  company: modeStatsBlockSchema,
  historical: modeStatsBlockSchema,
  team: modeStatsBlockSchema,
  regular_team: modeStatsBlockSchema,
  stronghold_skirmish: modeStatsBlockSchema,
  stronghold_defense: modeStatsBlockSchema,
  globalmap_absolute: modeStatsBlockSchema,
  globalmap_champion: modeStatsBlockSchema,
  globalmap_middle: modeStatsBlockSchema,
  epic: modeStatsBlockSchema,
  fallout: modeStatsBlockSchema,
  ranked_battles: modeStatsBlockSchema,
  trees_cut: z.number().optional(),
  frags: z.record(z.string(), z.number()).nullish()
});

export const accountInfoSchema = z.looseObject({
  account_id: z.number(),
  nickname: z.string(),
  clan_id: z.number().nullable(),
  global_rating: z.number(),
  created_at: z.number(),
  last_battle_time: z.number(),
  logout_at: z.number().nullish(),
  updated_at: z.number(),
  client_language: z.string().nullish(),
  statistics: accountStatisticsSchema,
  private: z.record(z.string(), z.unknown()).nullish()
});

export const accountTankSchema = z.looseObject({
  tank_id: z.number(),
  mark_of_mastery: z.number(),
  statistics: z.looseObject({ battles: z.number(), wins: z.number() })
});

export const accountAchievementsSchema = z.looseObject({
  achievements: z.record(z.string(), z.number()),
  frags: z.record(z.string(), z.number()).nullish(),
  max_series: z.record(z.string(), z.number()).nullish()
});
