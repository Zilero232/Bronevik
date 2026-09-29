import { z } from 'zod';

export const ratingEntrySchema = z.looseObject({
  value: z.number().nullable(),
  rank: z.number().nullish(),
  rank_delta: z.number().nullish()
});

const entry = ratingEntrySchema.nullish().catch(null);

export const ratingAccountSchema = z.looseObject({
  account_id: z.number(),
  global_rating: entry,
  battles_count: entry,
  wins_ratio: entry,
  damage_avg: entry,
  damage_dealt: entry,
  frags_avg: entry,
  frags_count: entry,
  xp_avg: entry,
  xp_amount: entry,
  xp_max: entry,
  spotted_avg: entry,
  spotted_count: entry,
  survived_ratio: entry,
  hits_ratio: entry,
  capture_points: entry
});

const ratingTypeSchema = z.looseObject({
  type: z.string(),
  threshold: z.number().nullish(),
  rank_fields: z.array(z.string()).nullish()
});

export const ratingTypesSchema = z.record(z.string(), ratingTypeSchema);

export const ratingDatesSchema = z.record(z.string(), z.looseObject({ dates: z.array(z.number()).nullish() }));

export const ratingListSchema = z.array(ratingAccountSchema);
