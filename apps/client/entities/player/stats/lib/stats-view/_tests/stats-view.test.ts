import { describe, expect, it } from 'vitest';

import { periodStats, signed, winRateTone } from '..';

const BLOCK = {
  battles: 100,
  winRate: 55,
  avgDamage: 2_000,
  avgFrags: 1,
  avgSpotted: 1,
  avgXp: 700,
  avgBlocked: 500,
  avgAssisted: 400,
  survivalRate: 40,
  accuracy: 70,
  avgTier: 8,
  wn8: { value: 2_000, tier: null },
  eff: { value: 1_500, tier: null },
  broneIndex: { value: 7_000, tier: null }
};

describe('winRateTone', () => {
  it('rates a higher win rate at least as well as a lower one', () => {
    const tones = ['bad', 'below', 'average', 'good', 'great', 'unicum'];

    expect(tones.indexOf(winRateTone(62))).toBeGreaterThanOrEqual(tones.indexOf(winRateTone(48)));
  });
});

describe('periodStats', () => {
  const recent = [{ period: '7d' as const, from: null, to: null, stats: { ...BLOCK, battles: 7 } }];

  it('returns the lifetime block for the overall period', () => {
    expect(periodStats({ overall: BLOCK, recent, period: 'overall' })).toBe(BLOCK);
  });

  it('returns the recent block for a recent period', () => {
    expect(periodStats({ overall: BLOCK, recent, period: '7d' })?.battles).toBe(7);
  });

  it('returns nothing for a period without data', () => {
    expect(periodStats({ overall: BLOCK, recent, period: '24h' })).toBeNull();
  });
});

describe('signed', () => {
  it('prefixes a gain with a plus', () => {
    expect(signed({ value: 12 })).toBe('+12');
  });

  it('keeps the minus of a loss', () => {
    expect(signed({ value: -1.234, digits: 1 })).toBe('-1.2');
  });

  it('leaves a missing delta missing', () => {
    expect(signed({ value: undefined })).toBeUndefined();
  });
});
