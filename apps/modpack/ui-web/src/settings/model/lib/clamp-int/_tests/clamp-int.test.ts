import { describe, expect, it } from 'vitest';

import { clampInt } from '../clamp-int';

describe('clampInt', () => {
  it('parses and clamps to the schema limits', () => {
    expect(clampInt({ raw: ' 42 ', min: 10, max: 1440 })).toBe(42);
    expect(clampInt({ raw: '5', min: 10, max: 1440 })).toBe(10);
    expect(clampInt({ raw: '99999', min: 10, max: 1440 })).toBe(1440);
    expect(clampInt({ raw: '-3', min: null, max: null })).toBe(-3);
  });

  it('refuses text that is not a number', () => {
    expect(clampInt({ raw: 'abc', min: 0, max: 10 })).toBeNull();
    expect(clampInt({ raw: '', min: 0, max: 10 })).toBeNull();
  });
});
