import type { RATING_SCALES, RATING_TIERS } from './scale.constants';

export type RatingTier = (typeof RATING_TIERS)[number];

export type RatingScale = keyof typeof RATING_SCALES;

export type RatingTierInput = {
  scale: RatingScale;
  value: number;
};
