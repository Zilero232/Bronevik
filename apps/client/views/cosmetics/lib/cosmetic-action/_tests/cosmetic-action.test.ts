import { describe, expect, it } from 'vitest';

import type { CosmeticActionInput } from '../cosmetic-action.types';

import { cosmeticAction } from '../cosmetic-action';

const nothing = { badge: null, frame: null, banner: null };
const shopFrame: CosmeticActionInput['item'] = { code: 'frame-gold', slot: 'frame', source: 'shop', price: 800, isUsable: false };

describe('cosmeticAction', () => {
  it('offers to buy a shop item a subscriber can afford', () => {
    expect(cosmeticAction({ item: shopFrame, equipped: nothing, isPlus: true, balance: 800 })).toBe('buy');
  });

  it('reports a shortfall one shell below the price', () => {
    expect(cosmeticAction({ item: shopFrame, equipped: nothing, isPlus: true, balance: 799 })).toBe('short');
  });

  it('asks a free user for Plus before buying', () => {
    expect(cosmeticAction({ item: shopFrame, equipped: nothing, isPlus: false, balance: 5000 })).toBe('plus');
  });

  it('equips an owned item and removes the equipped one', () => {
    const owned = { ...shopFrame, isUsable: true };

    expect(cosmeticAction({ item: owned, equipped: nothing, isPlus: false, balance: 0 })).toBe('equip');
    expect(cosmeticAction({ item: owned, equipped: { ...nothing, frame: 'frame-gold' }, isPlus: false, balance: 0 })).toBe('unequip');
  });

  it('never offers to equip an overlay theme on the profile', () => {
    const theme: CosmeticActionInput['item'] = { code: 'overlay-hud', slot: 'overlayTheme', source: 'plus', price: null, isUsable: true };

    expect(cosmeticAction({ item: theme, equipped: nothing, isPlus: true, balance: 0 })).toBe('owned');
  });

  it('asks for Plus to use a Plus item', () => {
    const plusBadge: CosmeticActionInput['item'] = { code: 'badge-plus', slot: 'badge', source: 'plus', price: null, isUsable: false };

    expect(cosmeticAction({ item: plusBadge, equipped: nothing, isPlus: false, balance: 0 })).toBe('plus');
  });
});
