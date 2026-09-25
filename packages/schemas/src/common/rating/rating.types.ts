import type { z } from 'zod';

import type { ratingKindSchema, ratingTierSchema, ratingValueSchema, statsBlockSchema } from './rating.schemas';

export type RatingTier = z.infer<typeof ratingTierSchema>;
export type RatingKind = z.infer<typeof ratingKindSchema>;
export type RatingValue = z.infer<typeof ratingValueSchema>;
export type StatsBlock = z.infer<typeof statsBlockSchema>;
