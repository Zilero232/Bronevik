import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Vehicle } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { CatalogEntry, VehicleCatalogService } from '../../../reference';

import { AppNotFoundException } from '../../../../common/exceptions';
import { TechTreeService } from '../tech-tree.service';

const entry: CatalogEntry = {
  summary: {
    tankId: 1,
    name: 'MS-1',
    shortName: 'MS-1',
    slug: 'ms-1',
    nation: 'ussr',
    type: 'lightTank',
    tier: 1,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  dbType: 'lightTank',
  specs: null,
  description: null
};

const createService = (vehicles: Vehicle[]) => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();

  prisma.vehicle.findMany.mockResolvedValue(vehicles);
  catalog.filter.mockResolvedValue([entry]);

  return { service: new TechTreeService(prisma, catalog), catalog };
};

describe('TechTreeService', () => {
  it('answers 404 when the nation has no vehicles', async () => {
    const { service } = createService([]);

    await expect(service.tree('atlantis')).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('builds the tree from the catalog of the requested nation', async () => {
    const { service, catalog } = createService([
      mock<Vehicle>({ tankId: entry.summary.tankId, nextTanks: [], prevTankIds: [], priceCredit: null, priceGold: null }),
      mock<Vehicle>({ tankId: 2, nextTanks: [], prevTankIds: [], priceCredit: null, priceGold: null })
    ]);

    const tree = await service.tree(entry.summary.nation);

    expect(tree.nation).toBe(entry.summary.nation);
    expect(tree.nodes.map((node) => node.vehicle)).toEqual([entry.summary]);
    expect(catalog.filter).toHaveBeenCalledWith({ nations: [entry.summary.nation] });
  });
});
