import { describe, expect, it } from 'vitest';

import { PLAYTIME } from '../../../config';
import { playtimeShift } from '../playtime-shift';

describe('playtimeShift', () => {
  it('stays neutral for a slot without a win rate', () => {
    expect(playtimeShift(null)).toBe(0);
  });

  it('stays neutral at the neutral win rate', () => {
    expect(playtimeShift(PLAYTIME.neutralRate)).toBe(0);
  });

  it('leans positive above and negative below the neutral rate', () => {
    expect(playtimeShift(PLAYTIME.neutralRate + 1)).toBeGreaterThan(0);
    expect(playtimeShift(PLAYTIME.neutralRate - 1)).toBeLessThan(0);
  });

  it('never leaves the -1…1 band', () => {
    expect(playtimeShift(100)).toBe(1);
    expect(playtimeShift(0)).toBe(-1);
  });
});
