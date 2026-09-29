import type { VehicleCatalogItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { TANK_COLLECTION_SLUGS, TANK_COLLECTIONS } from '../../../config';
import { collectionVehicles, isTankCollection, matchesCollection } from '../tank-collections';

const vehicle = (patch: Partial<VehicleCatalogItem>): VehicleCatalogItem => ({
  tankId: 1,
  name: 'T',
  shortName: 'T',
  slug: 't',
  nation: 'ussr',
  type: 'heavyTank',
  tier: 8,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null },
  role: null,
  isPreferential: false,
  ...patch
});

describe('isTankCollection', () => {
  it('accepts every configured collection and nothing else', () => {
    expect(TANK_COLLECTION_SLUGS.every(isTankCollection)).toBe(true);
    expect(isTankCollection('armor')).toBe(false);
  });
});

describe('matchesCollection', () => {
  it('requires every criterion of the collection', () => {
    const criteria = { statuses: ['premium'], tiers: [8] } as const;

    expect(matchesCollection({ vehicle: vehicle({ status: 'premium', tier: 8 }), criteria })).toBe(true);
    expect(matchesCollection({ vehicle: vehicle({ status: 'premium', tier: 9 }), criteria })).toBe(false);
    expect(matchesCollection({ vehicle: vehicle({ status: 'reward', tier: 8 }), criteria })).toBe(false);
  });

  it('never puts a vehicle without a role into a collection by role', () => {
    expect(matchesCollection({ vehicle: vehicle({ role: null }), criteria: { roles: ['HT_break'] } })).toBe(false);
  });

  it('reads preferential matchmaking from the catalog flag', () => {
    expect(matchesCollection({ vehicle: vehicle({ isPreferential: true }), criteria: TANK_COLLECTIONS.preferential })).toBe(true);
    expect(matchesCollection({ vehicle: vehicle({ isPreferential: false }), criteria: TANK_COLLECTIONS.preferential })).toBe(false);
  });
});

describe('collectionVehicles', () => {
  it('lists the matching vehicles from the highest tier down, by name within a tier', () => {
    const catalog = [
      vehicle({ tankId: 1, name: 'B', type: 'lightTank', tier: 8 }),
      vehicle({ tankId: 2, name: 'A', type: 'lightTank', tier: 8 }),
      vehicle({ tankId: 3, name: 'C', type: 'lightTank', tier: 10 }),
      vehicle({ tankId: 4, name: 'D', type: 'mediumTank', tier: 10 })
    ];

    expect(collectionVehicles({ catalog, slug: 'scouts' }).map(({ tankId }) => tankId)).toEqual([3, 2, 1]);
  });

  it('returns an empty list for an empty catalog', () => {
    expect(collectionVehicles({ catalog: [], slug: 'collector' })).toEqual([]);
  });
});
