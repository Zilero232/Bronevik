import { describe, expect, it } from 'vitest';

import { clampInt } from '../clamp-int';

describe(clampInt, () => {
  it('parses a number inside the limits, spaces trimmed', () => {
    expect(clampInt({ raw: ' 42 ', min: 10, max: 1440 })).toBe(42);
  });

  it('raises a number below the minimum to the minimum', () => {
    expect(clampInt({ raw: '5', min: 10, max: 1440 })).toBe(10);
  });

  it('lowers a number above the maximum to the maximum', () => {
    expect(clampInt({ raw: '99999', min: 10, max: 1440 })).toBe(1440);
  });

  it('keeps any number when the schema sets no limits', () => {
    expect(clampInt({ raw: '-3', min: null, max: null })).toBe(-3);
  });

  it.each(['abc', ''])('refuses %j, which is not a number', (raw) => {
    expect(clampInt({ raw, min: 0, max: 10 })).toBeNull();
  });
});
