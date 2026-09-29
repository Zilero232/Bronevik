import { describe, expect, it } from 'vitest';

import { VEHICLE_KIND_QUERY } from '../../../config';
import { loadVehicleFilters, vehicleQuery, vehicleTraitQuery } from '../vehicle-query';

const NO_FILTERS = loadVehicleFilters(new URLSearchParams());

describe('vehicleQuery', () => {
  it('sends neither premium nor collectible for all tanks', () => {
    expect(vehicleQuery(NO_FILTERS)).toEqual({ tiers: [], types: [], nations: [] });
  });

  it('turns every kind into the flags the API filters on', () => {
    for (const kind of ['regular', 'premium', 'collector'] as const) {
      expect(vehicleQuery({ ...NO_FILTERS, premium: kind })).toEqual({ tiers: [], types: [], nations: [], ...VEHICLE_KIND_QUERY[kind] });
    }
  });

  it('keeps collector tanks out of the premium kind', () => {
    expect(vehicleQuery({ ...NO_FILTERS, premium: 'premium' })).toMatchObject({ premium: true, collectible: false });
  });
});

describe('vehicleTraitQuery', () => {
  it('passes the chosen roles through', () => {
    expect(vehicleTraitQuery({ roles: ['HT_break'] })).toEqual({ roles: ['HT_break'] });
  });
});

describe('loadVehicleFilters', () => {
  it('reads the same filters from the URL that the page prefetches with', () => {
    const filters = loadVehicleFilters(new URLSearchParams('tiers=8,10&types=heavyTank&nations=ussr,germany&premium=collector&roles=HT_break'));

    expect(vehicleQuery(filters)).toEqual({ tiers: [8, 10], types: ['heavyTank'], nations: ['ussr', 'germany'], collectible: true });
    expect(filters.roles).toEqual(['HT_break']);
  });

  it('falls back to no filters for an empty or unknown query', () => {
    const filters = loadVehicleFilters(new URLSearchParams('premium=gold&roles=pilot'));

    expect(vehicleQuery(filters)).toEqual({ tiers: [], types: [], nations: [] });
    expect(filters.roles).toEqual([]);
  });
});
