import { describe, expect, it } from 'vitest';

import { scaledRating } from '..';

describe('scaledRating', () => {
  it('keeps an empty value without a tier', () => {
    expect(scaledRating({ scale: 'wn8', value: null })).toEqual({ value: null, tier: null });
  });

  it('derives the tier from the scale', () => {
    const rating = scaledRating({ scale: 'wn8', value: 5_000 });

    expect(rating.value).toBe(5_000);
    expect(rating.tier).not.toBeNull();
  });
});
