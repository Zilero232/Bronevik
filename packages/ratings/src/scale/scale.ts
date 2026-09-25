import { findLastIndex } from 'remeda';

import type { RatingTier, RatingTierInput } from './scale.types';

import { RATING_SCALES, RATING_TIERS } from './scale.constants';

export const ratingTier = ({ scale, value }: RatingTierInput): RatingTier =>
  RATING_TIERS[findLastIndex(RATING_SCALES[scale], (bound) => value >= bound)] ?? RATING_TIERS[0];
