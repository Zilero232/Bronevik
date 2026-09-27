import { describe, expect, it } from 'vitest';

import type { CatalogEntry } from '../../../reference.types';

import { unknownVehicle } from '../../../mappers';
import { matchesFilter } from '../catalog-entry';

const ENTRY: CatalogEntry = {
  summary: { ...unknownVehicle(1), tier: 8, nation: 'ussr', type: 'AT-SPG', isPremium: true, isCollectible: false },
  dbType: 'atSpg',
  specs: null,
  description: null
};

describe('matchesFilter', () => {
  it('matches everything with an empty filter or empty lists', () => {
    expect(matchesFilter({ entry: ENTRY, filter: {} })).toBe(true);
    expect(matchesFilter({ entry: ENTRY, filter: { tiers: [], types: [], nations: [] } })).toBe(true);
  });

  it('filters by tier', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { tiers: [8, 10] } })).toBe(true);
    expect(matchesFilter({ entry: ENTRY, filter: { tiers: [10] } })).toBe(false);
  });

  it('maps the public vehicle type onto the database type', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { types: ['AT-SPG'] } })).toBe(true);
    expect(matchesFilter({ entry: ENTRY, filter: { types: ['SPG'] } })).toBe(false);
  });

  it('filters by nation', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { nations: ['ussr'] } })).toBe(true);
    expect(matchesFilter({ entry: ENTRY, filter: { nations: ['germany'] } })).toBe(false);
  });

  it('distinguishes premium false from an unset premium filter', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { premium: false } })).toBe(false);
    expect(matchesFilter({ entry: ENTRY, filter: { premium: true } })).toBe(true);
  });

  it('distinguishes collectible false from an unset collectible filter', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { collectible: false } })).toBe(true);
    expect(matchesFilter({ entry: ENTRY, filter: { collectible: true } })).toBe(false);
  });

  it('requires every set criterion to match', () => {
    expect(matchesFilter({ entry: ENTRY, filter: { tiers: [8], nations: ['germany'] } })).toBe(false);
  });
});
