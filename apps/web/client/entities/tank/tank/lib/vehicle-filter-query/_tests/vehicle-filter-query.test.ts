import { describe, expect, it } from 'vitest';

import { vehicleFilterQuery } from '../vehicle-filter-query';

describe('vehicleFilterQuery', () => {
  it('drops empty filter lists and keeps the rest of the query', () => {
    expect(vehicleFilterQuery({ tiers: [], types: ['heavyTank'], limit: 10 })).toEqual({
      limit: 10,
      tiers: undefined,
      types: ['heavyTank'],
      nations: undefined,
      statuses: undefined,
      roles: undefined,
      difficulties: undefined
    });
  });
});
