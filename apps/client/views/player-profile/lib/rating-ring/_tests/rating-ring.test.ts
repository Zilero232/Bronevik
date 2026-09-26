import { RATING_TIERS } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { ratingRing } from '../rating-ring';

describe('ratingRing', () => {
  it('fills by tier position', () => {
    expect(ratingRing('very_bad')).toEqual({ value: 1, max: RATING_TIERS.length });
    expect(ratingRing('super_unicum')).toEqual({ value: RATING_TIERS.length, max: RATING_TIERS.length });
  });

  it('is empty without a tier', () => {
    expect(ratingRing(null).value).toBe(0);
  });
});
