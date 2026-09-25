import type { RatingValue } from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';

import type { RatingValueInput } from './rating.types';

import { RATING_SCALE } from './rating.constants';

export const ratingValue = ({ kind, value }: RatingValueInput): RatingValue => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return { value: null, tier: null };
  }

  return { value, tier: ratingTier({ scale: RATING_SCALE[kind], value }) };
};

export const emptyRating = (): RatingValue => ({ value: null, tier: null });
