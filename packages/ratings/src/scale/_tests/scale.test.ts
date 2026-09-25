import { describe, expect, it } from 'vitest';

import type { RatingScale } from '..';

import { RATING_SCALES, RATING_TIERS, ratingTier } from '..';

const scales = Object.keys(RATING_SCALES).filter((key): key is RatingScale => key in RATING_SCALES);

describe('ratingTier', () => {
  it.each(scales)('%s has one strictly increasing lower bound per tier', (scale) => {
    const bounds = RATING_SCALES[scale];

    expect(bounds).toHaveLength(RATING_TIERS.length);

    bounds.slice(1).forEach((bound, index) => {
      expect(bound).toBeGreaterThan(bounds[index] ?? Number.POSITIVE_INFINITY);
    });
  });

  it.each(scales)('%s maps each lower bound to its own tier and the value just below to the previous one', (scale) => {
    RATING_SCALES[scale].forEach((bound, index) => {
      expect(ratingTier({ scale, value: bound })).toBe(RATING_TIERS[index]);

      if (index > 0) {
        expect(ratingTier({ scale, value: bound - 0.01 })).toBe(RATING_TIERS[index - 1]);
      }
    });
  });

  it('treats negative values as the lowest tier', () => {
    expect(ratingTier({ scale: 'wn8', value: -5 })).toBe(RATING_TIERS[0]);
  });
});
