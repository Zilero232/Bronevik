import { describe, expect, it } from 'vitest';

import { GOLD } from '../../../config';
import { creditsToGold, freeXpToGold, goldToCredits, goldToFreeXp } from '../gold-conversion';

describe('gold and credits', () => {
  it('round-trips a whole number of gold', () => {
    expect(creditsToGold(goldToCredits(1_250))).toBe(1_250);
  });

  it('rounds the gold up so the credits are always covered', () => {
    expect(goldToCredits(creditsToGold(GOLD.creditsPerGold + 1))).toBeGreaterThanOrEqual(GOLD.creditsPerGold + 1);
  });

  it('never converts a negative amount', () => {
    expect(goldToCredits(-5)).toBe(0);
    expect(creditsToGold(-5)).toBe(0);
  });
});

describe('gold and free experience', () => {
  it('round-trips a whole number of gold', () => {
    expect(freeXpToGold(goldToFreeXp(640))).toBe(640);
  });

  it('rounds the gold up so the experience is always covered', () => {
    expect(goldToFreeXp(freeXpToGold(GOLD.xpPerGold * 3 + 1))).toBeGreaterThanOrEqual(GOLD.xpPerGold * 3 + 1);
  });
});
