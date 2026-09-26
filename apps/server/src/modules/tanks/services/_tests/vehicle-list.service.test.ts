import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { CatalogEntry, VehicleCatalogService } from '../../../reference';

import { VehicleListService } from '../vehicle-list.service';

const entry = (summary: Pick<VehicleSummary, 'name' | 'nation' | 'tankId' | 'tier'>): CatalogEntry => ({
  summary: {
    ...summary,
    shortName: summary.name,
    slug: summary.name,
    type: 'mediumTank',
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  dbType: 'mediumTank',
  specs: null,
  description: null
});

describe('VehicleListService', () => {
  it('orders vehicles by nation, then tier, then name', async () => {
    const catalog = mock<VehicleCatalogService>();

    catalog.filter.mockResolvedValue([
      entry({ tankId: 1, nation: 'usa', tier: 1, name: 'A' }),
      entry({ tankId: 2, nation: 'germany', tier: 10, name: 'B' }),
      entry({ tankId: 3, nation: 'germany', tier: 5, name: 'Z' }),
      entry({ tankId: 4, nation: 'germany', tier: 5, name: 'C' })
    ]);

    const list = await new VehicleListService(catalog).list({});

    expect(list.map((vehicle) => vehicle.tankId)).toEqual([4, 3, 2, 1]);
  });

  it('passes the filter to the catalog', async () => {
    const catalog = mock<VehicleCatalogService>();
    const filter = { nations: ['ussr'] };

    catalog.filter.mockResolvedValue([]);

    await expect(new VehicleListService(catalog).list(filter)).resolves.toEqual([]);
    expect(catalog.filter).toHaveBeenCalledWith(filter);
  });
});
