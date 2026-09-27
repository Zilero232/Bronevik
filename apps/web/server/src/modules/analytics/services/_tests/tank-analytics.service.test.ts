import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { ExpectedValuesService, VehicleCatalogService } from '../../../reference';
import { AnalyticsOverviewService } from '../analytics-overview.service';
import { OwnAccountService } from '../own-account.service';
import { TankAnalyticsService } from '../tank-analytics.service';
import { catalogOf, rawRow, vehicle } from './analytics.fixtures';

const tank = vehicle({ tankId: 1 });

const moeBattle = (startedAt: string, moePercent: number | null) => Object.assign(mock<Battle>(), { startedAt: new Date(startedAt), moePercent });

const setup = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const expected = mock<ExpectedValuesService>();
  const accounts = mock<OwnAccountService>();
  const overview = mock<AnalyticsOverviewService>();

  accounts.resolve.mockResolvedValue(7n);
  expected.all.mockResolvedValue(new Map());
  catalog.all.mockResolvedValue(catalogOf(tank));
  overview.trend.mockResolvedValue([]);
  prisma.battle.findMany.mockResolvedValue([]);

  return { prisma, overview, service: new TankAnalyticsService(prisma, catalog, expected, accounts, overview) };
};

describe('TankAnalyticsService.tank', () => {
  it('returns an unknown vehicle and empty series without data', async () => {
    const { service } = setup();

    expect(await service.tank({ userId: 'u', tankId: 999, granularity: 'week' })).toMatchObject({
      vehicle: null,
      totals: { battles: 0 },
      points: [],
      moe: []
    });
  });

  it('reads the tank trend over all time', async () => {
    const { overview, service } = setup();

    await service.tank({ userId: 'u', tankId: tank.tankId, granularity: 'month' });

    expect(overview.trend).toHaveBeenCalledWith(expect.objectContaining({ from: null, tankId: tank.tankId, granularity: 'month' }));
  });

  it('totals the trend buckets', async () => {
    const { overview, service } = setup();

    overview.trend.mockResolvedValue([
      { ...rawRow({ tank_id: tank.tankId, battles: 4, wins: 2 }), bucket: new Date('2026-09-01T00:00:00Z') },
      { ...rawRow({ tank_id: tank.tankId, battles: 6, wins: 4 }), bucket: new Date('2026-08-01T00:00:00Z') }
    ]);

    const result = await service.tank({ userId: 'u', tankId: tank.tankId, granularity: 'month' });

    expect(result.totals).toMatchObject({ battles: 10, winRate: 60 });
    expect(result.points).toHaveLength(2);
  });

  it('lists the MoE history oldest first', async () => {
    const { prisma, service } = setup();

    prisma.battle.findMany.mockResolvedValue([moeBattle('2026-09-26T10:00:00Z', 80), moeBattle('2026-09-25T10:00:00Z', 78)]);

    const { moe } = await service.tank({ userId: 'u', tankId: tank.tankId, granularity: 'week' });

    expect(moe.map((point) => point.percent)).toEqual([78, 80]);
  });
});
