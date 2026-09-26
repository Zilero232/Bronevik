import { describe, expect, it } from 'vitest';

import { isPlusState, plusLimit } from '../plus';
import { PLUS_LIMITS } from '../plus.constants';

describe('plusLimit', () => {
  it('gives the free number to a free user and the plus number to a subscriber', () => {
    expect(plusLimit({ key: 'goals', isPlus: false })).toBe(PLUS_LIMITS.goals.free);
    expect(plusLimit({ key: 'goals', isPlus: true })).toBe(PLUS_LIMITS.goals.plus);
  });

  it('never gives a subscriber less than a free user', () => {
    for (const { free, plus } of [
      PLUS_LIMITS.linkedAccounts,
      PLUS_LIMITS.goals,
      PLUS_LIMITS.watchedTanks,
      PLUS_LIMITS.overlays,
      PLUS_LIMITS.storedReplays
    ]) {
      expect(plus).toBeGreaterThan(free);
    }
  });
});

describe('isPlusState', () => {
  it('grants access during a trial, an active period and the payment grace', () => {
    expect(isPlusState('trial')).toBe(true);
    expect(isPlusState('active')).toBe(true);
    expect(isPlusState('grace')).toBe(true);
  });

  it('refuses access with no subscription or after expiry', () => {
    expect(isPlusState('none')).toBe(false);
    expect(isPlusState('expired')).toBe(false);
  });
});
