import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountTankRating, MoeProgress, MoeThreshold, PlayerTank } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { ThresholdsService, VehicleCatalogService } from '../../../reference';
import type { CatalogEntry } from '../../../reference/reference.types';
import type { CombinedDamageRow } from '../../players.types';

import { unknownVehicle } from '../../../reference/mappers';
import { PLAYER_MARKS } from '../../config';
import { PlayerMarksService } from '../player-marks.service';

const UPDATED_AT = new Date('2026-09-20T00:00:00.000Z');

const entry = (tankId: number, tier: number): CatalogEntry => ({
  summary: { ...unknownVehicle(tankId), tier },
  dbType: 'heavyTank',
  specs: null,
  description: null
});

const tank = (tankId: number, overrides: Partial<PlayerTank> = {}): PlayerTank =>
  mock<PlayerTank>({ tankId, battles: 100, marksOnGun: 0, markOfMastery: 0, updatedAt: UPDATED_AT, ...overrides });

const progress = (tankId: number, overrides: Partial<MoeProgress>): MoeProgress =>
  mock<MoeProgress>({ tankId, marks: 0, percent: 0, movingDamage: null, updatedAt: UPDATED_AT, ...overrides });

const threshold = (tankId: number): MoeThreshold => mock<MoeThreshold>({ tankId, p65: 2000, p85: 2500, p95: 3000, p100: 3500 });

type Setup = {
  tanks: PlayerTank[];
  catalog: CatalogEntry[];
  progress?: MoeProgress[];
  thresholds?: MoeThreshold[];
  combined?: CombinedDamageRow[];
  ratings?: AccountTankRating[];
};

const createService = (setup: Setup) => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const thresholds = mock<ThresholdsService>();

  prisma.playerTank.findMany.mockResolvedValue(setup.tanks);
  prisma.moeProgress.findMany.mockResolvedValue(setup.progress ?? []);
  prisma.$queryRaw.mockResolvedValue(setup.combined ?? []);
  prisma.accountTankRating.findMany.mockResolvedValue(setup.ratings ?? []);
  thresholds.latest.mockResolvedValue({ moe: new Map((setup.thresholds ?? []).map((row) => [row.tankId, row])), mastery: new Map() });
  catalog.all.mockResolvedValue(new Map(setup.catalog.map((item) => [item.summary.tankId, item])));

  return new PlayerMarksService(prisma, catalog, thresholds);
};

describe('PlayerMarksService.marks', () => {
  it('only lists tanks from the minimum tier that exist in the catalog', async () => {
    const service = createService({
      tanks: [tank(1), tank(2), tank(3)],
      catalog: [entry(1, PLAYER_MARKS.minTier), entry(2, PLAYER_MARKS.minTier - 1)]
    });

    const { items, summary } = await service.marks(42n);

    expect(items.map((item) => item.vehicle.tankId)).toEqual([1]);
    expect(summary.eligible).toBe(1);
  });

  it('prefers the mod-reported marks over the Lesta tank row', async () => {
    const service = createService({
      tanks: [tank(1, { marksOnGun: 1 })],
      catalog: [entry(1, 10)],
      progress: [progress(1, { marks: 2, percent: 90 })]
    });

    const { items, summary } = await service.marks(42n);

    expect(items[0]?.marksOnGun).toBe(2);
    expect(summary).toMatchObject({ moe2: 1, moe1: 0 });
  });

  it('computes the damage still missing for the next mark from the thresholds', async () => {
    const service = createService({
      tanks: [tank(1)],
      catalog: [entry(1, 10)],
      progress: [progress(1, { marks: 1, percent: 70, movingDamage: 2300 })],
      thresholds: [threshold(1)]
    });

    const [item] = (await service.marks(42n)).items;

    expect(item?.nextMarkPercent).toBe(85);
    expect(item?.damageToNextMark).toBe(2500 - 2300);
  });

  it('leaves the next-mark damage unknown without thresholds', async () => {
    const service = createService({ tanks: [tank(1)], catalog: [entry(1, 10)], progress: [progress(1, { percent: 50, movingDamage: 1800 })] });

    const [item] = (await service.marks(42n)).items;

    expect(item?.thresholds).toBeNull();
    expect(item?.damageToNextMark).toBeNull();
  });

  it('takes combined damage from recent battles before the rating average', async () => {
    const service = createService({
      tanks: [tank(1), tank(2), tank(3)],
      catalog: [entry(1, 10), entry(2, 10), entry(3, 10)],
      combined: [{ tank_id: 1, battles: 50, combined: 3100 }],
      ratings: [mock<AccountTankRating>({ tankId: 1, avgDamage: 2000 }), mock<AccountTankRating>({ tankId: 2, avgDamage: 1900 })]
    });

    const byTank = new Map((await service.marks(42n)).items.map((item) => [item.vehicle.tankId, item]));

    expect(byTank.get(1)).toMatchObject({ avgCombinedDamage: 3100, combinedDamageSource: 'battles' });
    expect(byTank.get(2)).toMatchObject({ avgCombinedDamage: 1900, combinedDamageSource: 'damage' });
    expect(byTank.get(3)).toMatchObject({ avgCombinedDamage: null, combinedDamageSource: null });
  });

  it('puts the tanks closest to their next mark first', async () => {
    const service = createService({
      tanks: [tank(1), tank(2), tank(3)],
      catalog: [entry(1, 10), entry(2, 10), entry(3, 10)],
      progress: [progress(1, { percent: 70, movingDamage: 2000 }), progress(2, { percent: 70, movingDamage: 2400 })],
      thresholds: [threshold(1), threshold(2)]
    });

    const { items } = await service.marks(42n);

    expect(items.map((item) => item.vehicle.tankId)).toEqual([2, 1, 3]);
  });
});
