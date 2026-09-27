import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { CatalogEntry, VehicleCatalogService } from '../../../reference';
import type { TraitsEntry } from '../../tanks.types';
import type { TankTraitsService } from '../tank-traits.service';

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

const traitsEntry = (role: TraitsEntry['traits']['role']): TraitsEntry => ({
  spec: { tags: [], role: null, notInShop: false },
  hasOffers: false,
  traits: { status: 'researchable', role }
});

const createService = (traits = new Map<number, TraitsEntry>()) => {
  const catalog = mock<VehicleCatalogService>();
  const tankTraits = mock<TankTraitsService>();

  tankTraits.all.mockResolvedValue(traits);

  return { service: new VehicleListService(catalog, tankTraits), catalog };
};

describe('VehicleListService', () => {
  it('orders vehicles by nation, then tier, then name', async () => {
    const { service, catalog } = createService();

    catalog.filter.mockResolvedValue([
      entry({ tankId: 1, nation: 'usa', tier: 1, name: 'A' }),
      entry({ tankId: 2, nation: 'germany', tier: 10, name: 'B' }),
      entry({ tankId: 3, nation: 'germany', tier: 5, name: 'Z' }),
      entry({ tankId: 4, nation: 'germany', tier: 5, name: 'C' })
    ]);

    const list = await service.list({});

    expect(list.map((vehicle) => vehicle.tankId)).toEqual([4, 3, 2, 1]);
  });

  it('adds each vehicle role and null for a vehicle without traits or role', async () => {
    const { service, catalog } = createService(
      new Map([
        [1, traitsEntry('MT_sniper')],
        [2, traitsEntry(null)]
      ])
    );

    catalog.filter.mockResolvedValue([
      entry({ tankId: 1, nation: 'ussr', tier: 10, name: 'A' }),
      entry({ tankId: 2, nation: 'ussr', tier: 10, name: 'B' }),
      entry({ tankId: 3, nation: 'ussr', tier: 10, name: 'C' })
    ]);

    const list = await service.list({});

    expect(list.map((vehicle) => vehicle.role)).toEqual(['MT_sniper', null, null]);
  });

  it('passes the filter to the catalog', async () => {
    const { service, catalog } = createService();
    const filter = { nations: ['ussr'] };

    catalog.filter.mockResolvedValue([]);

    await expect(service.list(filter)).resolves.toEqual([]);
    expect(catalog.filter).toHaveBeenCalledWith(filter);
  });
});
