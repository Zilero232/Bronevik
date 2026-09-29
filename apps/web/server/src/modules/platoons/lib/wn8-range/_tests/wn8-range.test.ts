import { describe, expect, it } from 'vitest';

import { inWn8Range } from '../wn8-range';

describe('inWn8Range', () => {
  it('accepts any rating, even an unknown one, when no bound is set', () => {
    expect(inWn8Range({ wn8: null })).toBe(true);
  });

  it('includes both bounds', () => {
    expect(inWn8Range({ wn8: 1000, minWn8: 1000, maxWn8: 2000 })).toBe(true);
    expect(inWn8Range({ wn8: 2000, minWn8: 1000, maxWn8: 2000 })).toBe(true);
  });

  it('refuses a rating outside the range', () => {
    expect(inWn8Range({ wn8: 999, minWn8: 1000 })).toBe(false);
    expect(inWn8Range({ wn8: 2001, maxWn8: 2000 })).toBe(false);
  });

  it('refuses an unknown rating once any bound is set', () => {
    expect(inWn8Range({ wn8: null, maxWn8: 2000 })).toBe(false);
  });
});
