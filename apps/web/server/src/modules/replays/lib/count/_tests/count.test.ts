import { describe, expect, it } from 'vitest';

import { toCount } from '../count';

describe('toCount', () => {
  it('rounds a finite value to a whole count', () => {
    expect(toCount(12.6)).toBe(13);
  });

  it('clamps a negative value to zero', () => {
    expect(toCount(-4)).toBe(0);
  });

  it('keeps zero apart from a missing value', () => {
    expect(toCount(0)).toBe(0);
    expect(toCount(null)).toBeNull();
    expect(toCount(undefined)).toBeNull();
  });

  it('returns null for a value that is not finite', () => {
    expect(toCount(Number.NaN)).toBeNull();
    expect(toCount(Number.POSITIVE_INFINITY)).toBeNull();
  });
});
