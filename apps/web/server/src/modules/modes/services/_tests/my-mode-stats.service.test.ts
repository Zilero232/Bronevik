import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { VehicleCatalogService } from '../../../reference';
import type { MyModeSqlRow } from '../../modes.types';

import { AppNotFoundException } from '../../../../common/exceptions';
import { bonusTypesOfMode } from '../../../../common/lib';
import { MyModeStatsService } from '../my-mode-stats.service';

const summary = (tankId: number): VehicleSummary => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'mediumTank',
  tier: 8,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
});

const typeOf = (mode: Parameters<typeof bonusTypesOfMode>[0]): string => bonusTypesOfMode(mode)[0] ?? '';

const row = (overrides: Pick<MyModeSqlRow, 'mode_types' | 'tank_id'> & Partial<MyModeSqlRow>): MyModeSqlRow => ({
  battles: 10,
  wins: 6,
  decided: 10,
  damage: 20_000,
  xp: 8_000,
  frags: 10,
  survived: 4,
  survival_known: 10,
  last_battle_at: new Date('2026-09-25T12:00:00Z'),
  ...overrides
});

const query = { days: 30 };

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();

  prisma.userLestaAccount.findFirst.mockResolvedValue(mock<UserLestaAccount>({ accountId: 42n }));
  prisma.$queryRaw.mockResolvedValue([]);
  catalog.summary.mockImplementation(async (tankId) => summary(tankId));

  return { service: new MyModeStatsService(prisma, catalog), prisma, catalog };
};

describe('MyModeStatsService.stats', () => {
  it('refuses a user without a linked Lesta account', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findFirst.mockResolvedValue(null);

    await expect(service.stats({ userId: 'u1', query })).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('reports the account and window with no modes when nothing was played', async () => {
    const { service } = createService();

    await expect(service.stats({ userId: 'u1', query })).resolves.toEqual({ accountId: 42, days: query.days, modes: [] });
  });

  it('keeps special modes and drops random and unknown battle types', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([
      row({ mode_types: typeOf('onslaught'), tank_id: 1 }),
      row({ mode_types: typeOf('random'), tank_id: 2 }),
      row({ mode_types: '99999', tank_id: 3 })
    ]);

    const stats = await service.stats({ userId: 'u1', query });

    expect(stats.modes.map((line) => line.mode)).toEqual(['onslaught']);
    expect(stats.modes[0]?.tanks.map((tank) => tank.vehicle.tankId)).toEqual([1]);
  });

  it('sums a mode across its tanks', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([
      row({ mode_types: typeOf('frontline'), tank_id: 1, battles: 10 }),
      row({ mode_types: typeOf('frontline'), tank_id: 2, battles: 5 })
    ]);

    const [frontline] = (await service.stats({ userId: 'u1', query })).modes;

    expect(frontline?.battles).toBe(15);
    expect(frontline?.tanks.map((tank) => tank.vehicle.tankId)).toEqual([1, 2]);
  });

  it('looks up a tank played in several modes only once', async () => {
    const { service, prisma, catalog } = createService();

    prisma.$queryRaw.mockResolvedValue([row({ mode_types: typeOf('onslaught'), tank_id: 7 }), row({ mode_types: typeOf('ranked'), tank_id: 7 })]);

    const stats = await service.stats({ userId: 'u1', query });

    expect(stats.modes).toHaveLength(2);
    expect(catalog.summary).toHaveBeenCalledTimes(1);
  });
});
