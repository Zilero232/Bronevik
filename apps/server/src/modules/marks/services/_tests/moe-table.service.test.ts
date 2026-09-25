import type { VehicleSummary } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { MoeThreshold } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { CatalogEntry } from '../../../reference';

import { ThresholdsService, VehicleCatalogService } from '../../../reference';
import { MOE_TABLE } from '../../config';
import { MoeTableService } from '../moe-table.service';

const vehicle = (tankId: number, name: string): VehicleSummary => ({
  tankId,
  name,
  shortName: name,
  slug: name,
  nation: 'ussr',
  type: 'heavyTank',
  tier: MOE_TABLE.minTier + 5,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
});

const entry = (summary: VehicleSummary): CatalogEntry => ({ summary, dbType: 'heavyTank', specs: null, description: null });

const threshold = (overrides: Partial<MoeThreshold>): MoeThreshold => ({
  tankId: 1,
  date: new Date('2026-09-20'),
  source: 'bronevik',
  p65: 2_000,
  p85: 2_600,
  p95: 3_100,
  p100: null,
  sampleSize: null,
  capturedAt: new Date(),
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const thresholds = mock<ThresholdsService>();
  const catalog = mock<VehicleCatalogService>();
  const empty = { moe: new Map(), mastery: new Map() };

  thresholds.latest.mockResolvedValue({ ...empty, at: Date.now() });
  thresholds.asOf.mockResolvedValue(empty);
  catalog.filter.mockResolvedValue([entry(vehicle(1, 'IS-7')), entry(vehicle(2, 'Object 279'))]);

  return { service: new MoeTableService(prisma, thresholds, catalog), prisma };
};

describe('MoeTableService.table', () => {
  it('finds tanks by a part of the name, ignoring case', async () => {
    const { service } = createService();

    const page = await service.table({ search: 'is-', limit: 25, offset: 0, order: 'desc' });

    expect(page.items.map((row) => row.vehicle.name)).toEqual(['IS-7']);
  });
});

describe('MoeTableService.historyBatch', () => {
  it('returns one series per requested tank, including those without data', async () => {
    const { service, prisma } = createService();

    prisma.moeThreshold.findMany.mockResolvedValue([threshold({ tankId: 1 })]);

    const batch = await service.historyBatch({ tankIds: [1, 2], days: 30 });

    expect(batch.series.map((series) => [series.tankId, series.points.length])).toEqual([
      [1, 1],
      [2, 0]
    ]);
  });
});
