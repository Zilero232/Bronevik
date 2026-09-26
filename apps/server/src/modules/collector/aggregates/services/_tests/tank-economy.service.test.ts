import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { EconomySqlRow } from '../../lib/tank-economy';

import { TANK_ECONOMY_AGGREGATE } from '../../config';
import { TankEconomyService } from '../tank-economy.service';
import { createPrisma, queryValues } from './aggregates.fixtures';

const NOW = new Date('2026-09-26T12:00:00Z');

const row: EconomySqlRow = {
  tank_id: 1,
  account: 'all',
  battles: TANK_ECONOMY_AGGREGATE.minBattles,
  players: 5,
  cost_battles: 0,
  credits: 30_000.4,
  credits_base: null,
  repair: 12_000,
  ammo: 3_000,
  consumables: 1_000,
  net: 14_000,
  xp: 900,
  free_xp: null
};

const createEconomy = (rows: EconomySqlRow[]) => {
  const prisma = createPrisma();

  prisma.$queryRaw.mockResolvedValue(rows);

  return { prisma, service: new TankEconomyService(prisma) };
};

describe('TankEconomyService.compute', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks for the minimum sample of random battles', async () => {
    const { prisma, service } = createEconomy([]);

    await service.compute();

    expect(queryValues(prisma)).toEqual(expect.arrayContaining([TANK_ECONOMY_AGGREGATE.minBattles, TANK_ECONOMY_AGGREGATE.randomBattleType]));
  });

  it('clears the table when no tank reaches the minimum sample', async () => {
    const { prisma, service } = createEconomy([]);

    expect(await service.compute()).toEqual({ rows: 0 });
    expect(prisma.tankEconomyAggregate.deleteMany).toHaveBeenCalledOnce();
    expect(prisma.tankEconomyAggregate.createMany.mock.calls[0]?.[0]?.data).toEqual([]);
  });

  it('hides cost medians for a tank without any fully costed battle', async () => {
    const { prisma, service } = createEconomy([row]);

    await service.compute();

    expect(prisma.tankEconomyAggregate.createMany.mock.calls[0]?.[0]?.data).toEqual([
      expect.objectContaining({ tankId: 1, repair: null, net: null, credits: Math.round(row.credits ?? 0), computedAt: NOW })
    ]);
  });
});
