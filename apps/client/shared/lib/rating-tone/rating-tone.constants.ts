import type { RatingTier } from '@bronevik/ratings';

export const RATING_TONES = ['bad', 'below', 'average', 'good', 'great', 'unicum'] as const;

export const TIER_TONE = {
  very_bad: 'bad',
  bad: 'bad',
  below_avg: 'below',
  avg: 'average',
  good: 'good',
  very_good: 'good',
  great: 'great',
  unicum: 'unicum',
  super_unicum: 'unicum'
} as const satisfies Record<RatingTier, (typeof RATING_TONES)[number]>;
