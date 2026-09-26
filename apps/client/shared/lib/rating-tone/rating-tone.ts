import type { RatingScale, RatingTier, RatingTierInput } from '@otmetki/ratings';

import { RATING_SCALES, RATING_TIERS, ratingTier } from '@otmetki/ratings';

import type { RatingTone } from './rating-tone.types';

import { TIER_TONE } from './rating-tone.constants';

export const toneOfTier = (tier: RatingTier): RatingTone => TIER_TONE[tier];

export const ratingTone = (input: RatingTierInput): RatingTone => toneOfTier(ratingTier(input));

export const toneThresholds = (scale: RatingScale) => {
  const bounds: readonly number[] = RATING_SCALES[scale];
  const thresholds: Partial<Record<RatingTone, number>> = {};

  RATING_TIERS.forEach((tier, index) => {
    const tone = toneOfTier(tier);

    thresholds[tone] ??= bounds[index];
  });

  return thresholds;
};
