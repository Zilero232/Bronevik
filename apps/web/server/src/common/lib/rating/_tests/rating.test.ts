import { ratingTier } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { emptyRating, ratingValue } from '../rating';
import { RATING_SCALE } from '../rating.constants';

describe('ratingValue', () => {
  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])('is empty for %s', (value) => {
    expect(ratingValue({ kind: 'wn8', value })).toEqual(emptyRating());
  });

  it('keeps a zero rating as a real value with a tier', () => {
    expect(ratingValue({ kind: 'wn8', value: 0 })).toEqual({ value: 0, tier: ratingTier({ scale: RATING_SCALE.wn8, value: 0 }) });
  });

  it('grades each kind on its own scale', () => {
    expect(ratingValue({ kind: 'broneIndex', value: 60 }).tier).toBe(ratingTier({ scale: RATING_SCALE.broneIndex, value: 60 }));
    expect(ratingValue({ kind: 'winRate', value: 60 }).tier).toBe(ratingTier({ scale: RATING_SCALE.winRate, value: 60 }));
  });
});
