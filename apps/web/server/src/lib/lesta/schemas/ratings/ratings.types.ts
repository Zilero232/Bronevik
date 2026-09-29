import type { z } from 'zod';

import type { ratingAccountSchema, ratingDatesSchema, ratingEntrySchema, ratingTypesSchema } from './ratings.schemas';

export type RatingEntry = z.infer<typeof ratingEntrySchema>;
export type RatingAccount = z.infer<typeof ratingAccountSchema>;
export type RatingTypes = z.infer<typeof ratingTypesSchema>;
export type RatingDates = z.infer<typeof ratingDatesSchema>;
export type RatingRankField = Exclude<keyof typeof ratingAccountSchema.shape, 'account_id'>;
