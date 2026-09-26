import { ratingTier } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { periodStats, scaledRating, winRateTone } from '..';

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

describe('scaledRating', () => {
  it('keeps an empty value without a tier', () => {
    expect(scaledRating({ scale: 'wn8', value: null })).toEqual({ value: null, tier: null });
  });

  it('derives the tier from the scale', () => {
    expect(scaledRating({ scale: 'wn8', value: 5_000 })).toEqual({ value: 5_000, tier: ratingTier({ scale: 'wn8', value: 5_000 }) });
  });

  it('gives a zero rating a tier instead of treating it as empty', () => {
    expect(scaledRating({ scale: 'wn8', value: 0 }).tier).not.toBeNull();
  });
});
