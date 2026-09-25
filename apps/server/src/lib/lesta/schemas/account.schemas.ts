import { z } from 'zod';

import { battleStatsBlockSchema } from './statistics.schemas';

const optionalBlock = battleStatsBlockSchema.optional();

export const accountListItemSchema = z.looseObject({
  account_id: z.number(),
  nickname: z.string()
});

export const accountListSchema = z.array(accountListItemSchema);

export const accountStatisticsSchema = z.looseObject({
  all: battleStatsBlockSchema,
  random: optionalBlock,
  clan: optionalBlock,
  company: optionalBlock,
  historical: optionalBlock,
  team: optionalBlock,
  regular_team: optionalBlock,
  stronghold_skirmish: optionalBlock,
  stronghold_defense: optionalBlock,
  globalmap_absolute: optionalBlock,
  globalmap_champion: optionalBlock,
  globalmap_middle: optionalBlock,
  epic: optionalBlock,
  fallout: optionalBlock,
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
