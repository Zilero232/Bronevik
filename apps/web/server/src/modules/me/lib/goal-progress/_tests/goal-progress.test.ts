import type { ExpectedValuesTable, TankTotals } from '@otmetki/ratings';

import { describe, expect, it } from 'vitest';

import { goalCurrent, goalOutcome, isWindowMetric, mergeTankTotals, windowTotals } from '../goal-progress';

const tank = (overrides: Partial<TankTotals> = {}): TankTotals => ({
  tankId: 1,
  battles: 2,
  wins: 1,
  damageDealt: 5000,
  frags: 2,
  spotted: 1,
  capturePoints: 0,
  droppedCapturePoints: 0,
  ...overrides
});

const expected: ExpectedValuesTable = new Map([[1, { tankId: 1, expDamage: 2000, expSpot: 1, expFrag: 1, expDef: 1, expWinRate: 50 }]]);

describe('mergeTankTotals', () => {
  it('sums the rows of one tank', () => {
    expect(mergeTankTotals([tank(), tank({ wins: 0 }), tank({ tankId: 2 })])).toEqual([
      expect.objectContaining({ tankId: 1, battles: 4, wins: 1, damageDealt: 10_000 }),
      expect.objectContaining({ tankId: 2, battles: 2 })
    ]);
  });
});

describe('windowTotals', () => {
  it('takes the source that saw more battles', () => {
    expect(windowTotals({ mod: [tank()], api: [tank({ battles: 5 })] })).toEqual([expect.objectContaining({ battles: 5 })]);
  });

  it('prefers the mod battles on a tie', () => {
    expect(windowTotals({ mod: [tank({ damageDealt: 1 })], api: [tank()] })).toEqual([expect.objectContaining({ damageDealt: 1 })]);
  });
});

describe('goalCurrent', () => {
  const tanks = [tank(), tank({ tankId: 1, battles: 2, wins: 2, damageDealt: 3000 })];

  it('counts battles, win rate and average damage over the window', () => {
    expect(goalCurrent({ metric: 'battles', tanks, expected, level: null })).toBe(4);
    expect(goalCurrent({ metric: 'winRate', tanks, expected, level: null })).toBe(75);
    expect(goalCurrent({ metric: 'avgDamage', tanks, expected, level: null })).toBe(2000);
  });

  it('computes the WN8 of the window battles', () => {
    expect(goalCurrent({ metric: 'wn8', tanks: mergeTankTotals(tanks), expected, level: null })).toBeGreaterThan(0);
  });

  it('knows nothing about a window without battles', () => {
    expect(goalCurrent({ metric: 'avgDamage', tanks: [], expected, level: null })).toBeNull();
  });

  it('reads the current level of the MoE and Bronya Index goals', () => {
    expect(goalCurrent({ metric: 'moe', tanks, expected, level: 86.2 })).toBe(86.2);
    expect(goalCurrent({ metric: 'broneIndex', tanks: [], expected, level: null })).toBeNull();
    expect(isWindowMetric('moe')).toBe(false);
  });
});

describe('goalOutcome', () => {
  it('completes a count or level goal as soon as it is reached', () => {
    expect(goalOutcome({ metric: 'battles', current: 10, target: 10, hasEnded: false })).toBe('achieved');
    expect(goalOutcome({ metric: 'moe', current: 85.1, target: 85, hasEnded: false })).toBe('achieved');
  });

  it('decides an average goal only when its window ends', () => {
    expect(goalOutcome({ metric: 'avgDamage', current: 3500, target: 3000, hasEnded: false })).toBeNull();
    expect(goalOutcome({ metric: 'avgDamage', current: 3500, target: 3000, hasEnded: true })).toBe('achieved');
  });

  it('fails a goal that ends below its target or without data', () => {
    expect(goalOutcome({ metric: 'winRate', current: 49, target: 55, hasEnded: true })).toBe('failed');
    expect(goalOutcome({ metric: 'battles', current: null, target: 10, hasEnded: true })).toBe('failed');
  });

  it('keeps an unreached goal active before its end', () => {
    expect(goalOutcome({ metric: 'battles', current: 3, target: 10, hasEnded: false })).toBeNull();
  });
});
