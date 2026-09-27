import type { RatingTier } from '@otmetki/ratings';

import { RATING_TIERS } from '@otmetki/ratings';

import type { RatingRing } from './rating-ring.types';

export const ratingRing = (tier: RatingTier | null): RatingRing => ({
  value: tier === null ? 0 : RATING_TIERS.indexOf(tier) + 1,
  max: RATING_TIERS.length
});
