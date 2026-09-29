import type { VehicleCatalogItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { similarTanks } from '../similar-tanks';

const tank = (tankId: number, overrides: Partial<VehicleCatalogItem> = {}): VehicleCatalogItem => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null },
  role: null,
  isPreferential: false,
  ...overrides
});

describe('similarTanks', () => {
  it('keeps the same tier and class, drops the tank itself and puts its nation first', () => {
    const catalog = [tank(1), tank(2, { nation: 'germany' }), tank(3), tank(4, { tier: 9 }), tank(5, { type: 'heavyTank' })];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 5 }).map(({ tankId }) => tankId)).toEqual([3, 2]);
  });

  it('puts tanks of the same role ahead of the nation match', () => {
    const catalog = [tank(1, { role: 'MT_universal' }), tank(2, { role: 'MT_support' }), tank(3, { nation: 'germany', role: 'MT_universal' })];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 5 }).map(({ tankId }) => tankId)).toEqual([3, 2]);
  });

  it('stops at the limit', () => {
    const catalog = [tank(1), tank(2), tank(3), tank(4)];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 2 })).toHaveLength(2);
  });

  it('prefers the same premium status once role and nation tie, then orders by name', () => {
    const catalog = [tank(1), tank(2, { isPremium: true, name: 'A' }), tank(3, { name: 'C' }), tank(4, { name: 'B' })];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 5 }).map(({ tankId }) => tankId)).toEqual([4, 3, 2]);
  });

  it('skips the role ordering when the tank itself is missing from the catalog', () => {
    const catalog = [tank(2, { role: 'MT_support', nation: 'germany', name: 'A' }), tank(3, { role: 'MT_universal', name: 'B' })];

    expect(similarTanks({ catalog, vehicle: tank(1, { role: 'MT_support' }), limit: 5 }).map(({ tankId }) => tankId)).toEqual([3, 2]);
  });

  it('returns nothing for an empty catalog', () => {
    expect(similarTanks({ catalog: [], vehicle: tank(1), limit: 5 })).toEqual([]);
  });
});
