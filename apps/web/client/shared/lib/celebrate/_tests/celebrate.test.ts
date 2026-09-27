import { describe, expect, it } from 'vitest';

import { isGain } from '../celebrate';

describe('isGain', () => {
  it('fires only when a known value grows', () => {
    expect(isGain({ previous: 4, next: 5 })).toBe(true);
    expect(isGain({ previous: 5, next: 5 })).toBe(false);
    expect(isGain({ previous: 5, next: 4 })).toBe(false);
  });

  it('stays quiet on the first sighting or missing data', () => {
    expect(isGain({ previous: null, next: 5 })).toBe(false);
    expect(isGain({ previous: 4, next: undefined })).toBe(false);
    expect(isGain({ previous: 4, next: null })).toBe(false);
  });
});
