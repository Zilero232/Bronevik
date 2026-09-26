import { describe, expect, it } from 'vitest';

import type { AggregateRow, BreakdownVehicle } from '../stat-line.types';

import { breakdown, statLine } from '../stat-line';

const row = (tankId: number, battles: number, wins: number): AggregateRow => ({
  tankId,
  battles,
  wins,
  damageDealt: battles * 1000,
  frags: battles,
  spotted: battles,
  capturePoints: 0,
  droppedCapturePoints: 0,
  survivedBattles: Math.floor(battles / 2)
});

const VEHICLES = new Map<number, BreakdownVehicle>([
  [1, { tier: 10, type: 'heavyTank', nation: 'ussr' }],
  [2, { tier: 8, type: 'heavyTank', nation: 'germany' }],
  [3, { tier: 10, type: 'mediumTank', nation: 'ussr' }]
]);

describe('statLine', () => {
  it('returns nulls for an empty window instead of zeros', () => {
    expect(statLine({ rows: [], expected: new Map() })).toEqual({ battles: 0, winRate: null, avgDamage: null, wn8: null, survivalRate: null });
  });

  it('weights the win rate by battles', () => {
    const line = statLine({ rows: [row(1, 10, 10), row(2, 30, 0)], expected: new Map() });

    expect(line.battles).toBe(40);
    expect(line.winRate).toBeCloseTo(25);
  });
});

describe('breakdown', () => {
  const rows = [row(1, 10, 5), row(2, 20, 10), row(3, 5, 1), row(99, 50, 50)];
  const result = breakdown({ rows, expected: new Map(), vehicles: VEHICLES });

  it('skips tanks missing from the catalog', () => {
    const total = result.byTier.reduce((sum, item) => sum + item.battles, 0);

    expect(total).toBe(35);
  });

  it('orders tiers from the highest', () => {
    expect(result.byTier.map((item) => item.key)).toEqual(['10', '8']);
  });

  it('orders classes and nations by battles', () => {
    expect(result.byClass[0]?.key).toBe('heavyTank');
    expect(result.byNation.map((item) => item.battles)).toEqual([...result.byNation.map((item) => item.battles)].sort((a, b) => b - a));
  });
});
