import { describe, expect, it } from 'vitest';

import { promoRejection } from '../promo-check';

const now = new Date('2026-09-25T12:00:00Z');
const valid = { expiresAt: null, maxUses: null, usedCount: 0 };

describe('promoRejection', () => {
  it('accepts a usable code', () => {
    expect(promoRejection({ promo: valid, now, alreadyRedeemed: false })).toBeNull();
  });

  it('names the reason a code cannot be used', () => {
    expect(promoRejection({ promo: null, now, alreadyRedeemed: false })).toBe('unknown');
    expect(promoRejection({ promo: { ...valid, expiresAt: now }, now, alreadyRedeemed: false })).toBe('expired');
    expect(promoRejection({ promo: { ...valid, maxUses: 5, usedCount: 5 }, now, alreadyRedeemed: false })).toBe('exhausted');
    expect(promoRejection({ promo: valid, now, alreadyRedeemed: true })).toBe('alreadyRedeemed');
  });

  it('accepts a code with one use left', () => {
    expect(promoRejection({ promo: { ...valid, maxUses: 5, usedCount: 4 }, now, alreadyRedeemed: false })).toBeNull();
  });
});
