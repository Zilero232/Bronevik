import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { VehicleCatalogService } from '../../../reference';
import type { TankDifficultyService } from '../tank-difficulty.service';

import { TankTraitsService } from '../tank-traits.service';
import { catalogEntry, catalogOf, vehicle } from './tanks.fixtures';

const researchable = catalogEntry(vehicle({ tankId: 1 }), { tags: [], role: 'role_HT_break', notInShop: false });
const collector = catalogEntry(vehicle({ tankId: 2, isPremium: true, isCollectible: true }));
const withdrawn = catalogEntry(vehicle({ tankId: 3, isPremium: true, tier: 8 }), { tags: [], role: null, notInShop: true });
const reward = catalogEntry(vehicle({ tankId: 4, isPremium: true, tier: 10 }), { tags: [], role: 'role_HT_assault', notInShop: true });

const entries = [researchable, collector, withdrawn, reward];

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const difficulty = mock<TankDifficultyService>();

  catalog.all.mockResolvedValue(catalogOf(...entries));
  prisma.$queryRaw.mockResolvedValue([{ tank_id: 3 }]);

  return { service: new TankTraitsService(prisma, catalog, difficulty), prisma, catalog, difficulty };
};

describe('TankTraitsService.of', () => {
  it('classifies every catalog tank by how it is obtained', async () => {
    const { service } = createService();

    expect((await service.of(1))?.traits).toEqual({ status: 'researchable', role: 'HT_break' });
    expect((await service.of(2))?.traits.status).toBe('collector');
    expect((await service.of(4))?.traits.status).toBe('reward');
  });

  it('treats a withdrawn premium that still appears in shop offers as a premium', async () => {
    const { service } = createService();

    const found = await service.of(3);

    expect(found?.hasOffers).toBe(true);
    expect(found?.traits.status).toBe('premium');
  });

  it('returns null for a tank outside the catalog', async () => {
    const { service } = createService();

    await expect(service.of(999)).resolves.toBeNull();
  });

  it('reads the catalog once for repeated lookups', async () => {
    const { service, catalog } = createService();

    await service.of(1);
    await service.traits(2);

    expect(catalog.all).toHaveBeenCalledTimes(1);
  });
});

describe('TankTraitsService.traits', () => {
  it('defaults an unknown tank to researchable without a role', async () => {
    const { service } = createService();

    await expect(service.traits(999)).resolves.toEqual({ status: 'researchable', role: null });
  });
});

describe('TankTraitsService.filter', () => {
  it('passes every entry through when no trait filter is set', async () => {
    const { service, catalog } = createService();

    const filtered = await service.filter({ entries, filter: {} });

    expect(filtered).toEqual(entries);
    expect(filtered).not.toBe(entries);
    expect(catalog.all).not.toHaveBeenCalled();
  });

  it('keeps only tanks of the requested statuses', async () => {
    const { service } = createService();

    const filtered = await service.filter({ entries, filter: { statuses: ['collector', 'reward'] } });

    expect(filtered.map((entry) => entry.summary.tankId)).toEqual([2, 4]);
  });

  it('keeps only tanks of the requested roles', async () => {
    const { service } = createService();

    const filtered = await service.filter({ entries, filter: { roles: ['HT_assault'] } });

    expect(filtered.map((entry) => entry.summary.tankId)).toEqual([4]);
  });

  it('drops entries the traits index does not know', async () => {
    const { service } = createService();

    const stray = catalogEntry(vehicle({ tankId: 50 }));

    expect(await service.filter({ entries: [stray], filter: { statuses: ['researchable'] } })).toEqual([]);
  });

  it('narrows by difficulty before applying the trait filter', async () => {
    const { service, difficulty } = createService();

    difficulty.matching.mockResolvedValue(new Set([1, 4]));

    const byDifficulty = await service.filter({ entries, filter: { difficulties: ['hard'] } });
    const both = await service.filter({ entries, filter: { difficulties: ['hard'], statuses: ['reward'] } });

    expect(byDifficulty.map((entry) => entry.summary.tankId)).toEqual([1, 4]);
    expect(both.map((entry) => entry.summary.tankId)).toEqual([4]);
  });

  it('ignores an empty difficulty list', async () => {
    const { service, difficulty } = createService();

    await service.filter({ entries, filter: { difficulties: [] } });

    expect(difficulty.matching).not.toHaveBeenCalled();
  });
});
