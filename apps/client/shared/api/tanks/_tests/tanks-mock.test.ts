import {
  serverPeriodSchema,
  tankComparisonSchema,
  tankDetailSchema,
  tankPatchesSchema,
  tankStatsPageSchema,
  tankTrendSchema,
  tierListSchema,
  topPlayersMetricSchema,
  topPlayersSchema,
  vehicleCatalogSchema
} from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_VEHICLES } from '@/shared/mocks';

import { mockCompareTanks } from '../compare-tanks.mock';
import { mockTankDetail, mockTankPatches, mockTankTopPlayers, mockTankTrend, mockVehicleStats } from '../tank-detail.mock';
import { mockTankStats, mockTierList, mockVehicleCatalog } from '../tanks.mock';

const [TANK, OTHER] = MOCK_VEHICLES;

describe('tanks mocks', () => {
  it('answer every endpoint in the shape the API contract promises', () => {
    expect(() => vehicleCatalogSchema.parse(mockVehicleCatalog())).not.toThrow();
    expect(() => tankStatsPageSchema.parse(mockTankStats({}))).not.toThrow();
    expect(() => tierListSchema.parse(mockTierList({}))).not.toThrow();
    expect(() => tankDetailSchema.parse(mockTankDetail({ idOrSlug: TANK.slug }))).not.toThrow();
    expect(() => tankTrendSchema.parse(mockTankTrend({ tankId: TANK.id }))).not.toThrow();
    expect(() => tankPatchesSchema.parse(mockTankPatches(TANK.id))).not.toThrow();
    expect(() => tankComparisonSchema.parse(mockCompareTanks({ tankIds: [TANK.id, OTHER.id] }))).not.toThrow();

    topPlayersMetricSchema.options.forEach((metric) =>
      expect(() => topPlayersSchema.parse(mockTankTopPlayers({ tankId: TANK.id, metric }))).not.toThrow()
    );
  });

  it('keep stats rows valid for every server period', () => {
    serverPeriodSchema.options.forEach((period) => expect(() => tankStatsPageSchema.parse(mockTankStats({ period }))).not.toThrow());
  });

  it('report a win-rate difference that matches the two rates it is made of', () => {
    mockTankStats({}).items.forEach(({ winRate, playerWinRate, winRateDiff }) => expect(winRateDiff).toBeCloseTo(winRate - playerWinRate, 1));
  });

  it('give the top profile no worse a gun than the stock one', () => {
    const stock = mockVehicleStats({ tank: TANK, profile: 'stock' });
    const top = mockVehicleStats({ tank: TANK, profile: 'top' });

    expect(top.reloadTime).toBeLessThanOrEqual(stock.reloadTime);
    expect(top.shell?.damage ?? 0).toBeGreaterThanOrEqual(stock.shell?.damage ?? 0);
  });

  it('return nothing for an unknown tank', () => {
    expect(mockTankDetail({ idOrSlug: 'no-such-tank' })).toBeNull();
    expect(mockTankPatches(-1).patches).toEqual([]);
  });
});
