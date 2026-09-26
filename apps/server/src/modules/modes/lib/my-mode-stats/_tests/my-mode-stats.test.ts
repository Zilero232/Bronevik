import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { MyModeRow } from '../my-mode-stats.types';

import { foldModeStats } from '../my-mode-stats';

const vehicleOf = (tankId: number): VehicleSummary => ({
  tankId,
  name: `T${tankId}`,
  shortName: `T${tankId}`,
  slug: String(tankId),
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
});

const vehicles = new Map([1, 2].map((tankId) => [tankId, vehicleOf(tankId)] as const));

const row = (overrides: Partial<MyModeRow>): MyModeRow => ({
  mode: 'onslaught',
  tankId: 1,
  battles: 4,
  wins: 2,
  decided: 4,
  damage: 8000,
  xp: 4000,
  frags: 4,
  survived: 1,
  survivalKnown: 4,
  lastBattleAt: new Date('2026-09-20T10:00:00Z'),
  ...overrides
});

describe('foldModeStats', () => {
  it('leaves out modes without battles', () => {
    expect(foldModeStats({ rows: [row({})], vehicles, tanksLimit: 5 }).map((line) => line.mode)).toEqual(['onslaught']);
  });

  it('sums the tanks of one mode and keeps the latest battle', () => {
    const [line] = foldModeStats({
      rows: [row({}), row({ tankId: 2, battles: 6, wins: 6, decided: 6, damage: 12_000, lastBattleAt: new Date('2026-09-25T10:00:00Z') })],
      vehicles,
      tanksLimit: 5
    });

    expect(line?.battles).toBe(10);
    expect(line?.winRate).toBe(80);
    expect(line?.avgDamage).toBe(2000);
    expect(line?.lastBattleAt).toBe('2026-09-25T10:00:00.000Z');
    expect(line?.tanks.map((tank) => tank.vehicle.tankId)).toEqual([2, 1]);
  });

  it('has no survival rate when no battle reported survival', () => {
    const [line] = foldModeStats({ rows: [row({ survived: 0, survivalKnown: 0 })], vehicles, tanksLimit: 5 });

    expect(line?.survivalRate).toBeNull();
  });
});
