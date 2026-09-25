import { describe, expect, it } from 'vitest';

import { TIERS, toRoman } from '../roman';
import { tierGlyphs } from '../tier-glyphs';

describe('toRoman', () => {
  it('produces a distinct numeral for every tier', () => {
    const numerals = TIERS.map((tier) => toRoman(tier));

    expect(new Set(numerals).size).toBe(TIERS.length);
  });

  it('only uses the glyphs the tier icon can draw', () => {
    TIERS.forEach((tier) => expect(toRoman(tier)).toMatch(/^[IVX]+$/));
  });

  it('uses subtractive notation for four and nine', () => {
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
  });
});

describe('tierGlyphs', () => {
  it('keeps every tier inside the 24px grid', () => {
    TIERS.forEach((tier) => {
      const coordinates = [...tierGlyphs(tier).rails.matchAll(/-?\d+(?:\.\d+)?/g)].map(([value]) => Number(value));

      coordinates.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(24);
      });
    });
  });
});
