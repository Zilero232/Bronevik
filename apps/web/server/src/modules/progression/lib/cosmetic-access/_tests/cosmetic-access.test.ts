import { describe, expect, it } from 'vitest';

import { isCosmeticUsable, visibleCosmetics } from '../cosmetic-access';

describe('isCosmeticUsable', () => {
  it('always allows default items', () => {
    expect(isCosmeticUsable({ item: { source: 'default' }, isOwned: false, isPlus: false })).toBe(true);
  });

  it('allows Plus items only while subscribed', () => {
    expect(isCosmeticUsable({ item: { source: 'plus' }, isOwned: false, isPlus: true })).toBe(true);
    expect(isCosmeticUsable({ item: { source: 'plus' }, isOwned: true, isPlus: false })).toBe(false);
  });

  it('keeps earned and bought items usable after Plus ends', () => {
    expect(isCosmeticUsable({ item: { source: 'shop' }, isOwned: true, isPlus: false })).toBe(true);
    expect(isCosmeticUsable({ item: { source: 'season' }, isOwned: true, isPlus: false })).toBe(true);
    expect(isCosmeticUsable({ item: { source: 'shop' }, isOwned: false, isPlus: true })).toBe(false);
  });
});

describe('visibleCosmetics', () => {
  it('hides Plus-only items once the subscription has ended', () => {
    const equipped = { badge: 'badge-plus', frame: 'frame-gold', banner: 'banner-steel' };

    expect(visibleCosmetics({ equipped, owned: new Set(['frame-gold']), isPlus: false })).toEqual({
      badge: null,
      frame: 'frame-gold',
      banner: 'banner-steel'
    });
  });

  it('drops an unknown code or one in the wrong slot', () => {
    const equipped = { badge: 'frame-gold', frame: 'frame-diamond', banner: null };

    expect(visibleCosmetics({ equipped, owned: new Set(['frame-gold', 'frame-diamond']), isPlus: true })).toEqual({
      badge: null,
      frame: null,
      banner: null
    });
  });
});
