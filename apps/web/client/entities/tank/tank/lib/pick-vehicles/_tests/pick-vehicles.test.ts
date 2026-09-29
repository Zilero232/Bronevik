import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { pickVehicles, vehicleIndex } from '../pick-vehicles';

const vehicle = (tankId: number): VehicleSummary => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
});

const CATALOG = [vehicle(1), vehicle(2), vehicle(3)];

describe('pickVehicles', () => {
  it('keeps the order of the mentioned ids', () => {
    expect(pickVehicles({ tankIds: [3, 1], catalog: CATALOG }).map((item) => item.tankId)).toEqual([3, 1]);
  });

  it('drops ids missing from the catalog and repeated mentions', () => {
    expect(pickVehicles({ tankIds: [2, 99, 2], catalog: CATALOG }).map((item) => item.tankId)).toEqual([2]);
  });

  it('returns nothing while the catalog is still loading', () => {
    expect(pickVehicles({ tankIds: [1], catalog: undefined })).toEqual([]);
  });
});

describe('vehicleIndex', () => {
  it('looks vehicles up by tank id', () => {
    expect(vehicleIndex(CATALOG)[2]?.slug).toBe('tank-2');
    expect(vehicleIndex(CATALOG)[42]).toBeUndefined();
  });
});
