import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Vehicle } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { VehicleCatalogService } from '../vehicle-catalog.service';

const vehicle = (tankId: number, overrides: Partial<Vehicle> = {}): Vehicle =>
  mock<Vehicle>({
    tankId,
    name: `Tank ${tankId}`,
    shortName: `T${tankId}`,
    slug: `tank-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: null,
    specs: null,
    description: null,
    ...overrides
  });

const createService = (rows: Vehicle[]) => {
  const prisma = mockDeep<PrismaService>();

  prisma.vehicle.findMany.mockResolvedValue(rows);

  return { service: new VehicleCatalogService(prisma), prisma };
};

describe('VehicleCatalogService', () => {
  it('loads the catalog once and serves later calls from the cache', async () => {
    const { service, prisma } = createService([vehicle(1)]);

    await service.all();
    await service.summary(1);

    expect(prisma.vehicle.findMany).toHaveBeenCalledOnce();
  });

  it('does not cache an empty catalog so a later import shows up', async () => {
    const { service, prisma } = createService([]);

    await expect(service.all()).resolves.toEqual(new Map());

    prisma.vehicle.findMany.mockResolvedValue([vehicle(1)]);

    expect((await service.all()).size).toBe(1);
  });

  it('answers a placeholder summary for an unknown tank and null from find', async () => {
    const { service } = createService([vehicle(1)]);

    expect((await service.summary(99)).name).toBe('#99');
    await expect(service.find(99)).resolves.toBeNull();
  });

  it('finds a tank by slug', async () => {
    const { service } = createService([vehicle(1), vehicle(2)]);

    expect((await service.bySlug('tank-2'))?.summary.tankId).toBe(2);
    await expect(service.bySlug('missing')).resolves.toBeNull();
  });

  it('maps tank ids to tiers', async () => {
    const { service } = createService([vehicle(1, { tier: 6 }), vehicle(2, { tier: 8 })]);

    expect(await service.tiers()).toEqual(
      new Map([
        [1, 6],
        [2, 8]
      ])
    );
  });

  it('filters the catalog', async () => {
    const { service } = createService([vehicle(1, { tier: 6 }), vehicle(2, { tier: 8 })]);

    const entries = await service.filter({ tiers: [8] });

    expect(entries.map((entry) => entry.summary.tankId)).toEqual([2]);
  });
});
