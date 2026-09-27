import { describe, expect, it } from 'vitest';

import { loadVehicleFilters, vehicleQuery } from '../vehicle-query';

describe('vehicleQuery', () => {
  it('sends no premium filter for all tanks', () => {
    expect(vehicleQuery({ tiers: [], types: [], nations: [], premium: 'all' })).toEqual({ tiers: [], types: [], nations: [], premium: undefined });
  });

  it('turns the premium choice into a boolean', () => {
    expect(vehicleQuery({ tiers: [10], types: ['heavyTank'], nations: ['ussr'], premium: 'regular' }).premium).toBe(false);
    expect(vehicleQuery({ tiers: [10], types: ['heavyTank'], nations: ['ussr'], premium: 'premium' }).premium).toBe(true);
  });
});

describe('loadVehicleFilters', () => {
  it('reads the same filters from the URL that the page prefetches with', () => {
    const filters = loadVehicleFilters(new URLSearchParams('tiers=8,10&types=heavyTank&nations=ussr,germany&premium=premium'));

    expect(vehicleQuery(filters)).toEqual({ tiers: [8, 10], types: ['heavyTank'], nations: ['ussr', 'germany'], premium: true });
  });

  it('falls back to no filters for an empty or unknown query', () => {
    expect(vehicleQuery(loadVehicleFilters(new URLSearchParams('premium=gold')))).toEqual({ tiers: [], types: [], nations: [], premium: undefined });
  });
});
