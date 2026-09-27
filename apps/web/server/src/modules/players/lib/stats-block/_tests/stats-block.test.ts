import { describe, expect, it } from 'vitest';

import type { BattleStatsBlock } from '../../../../../lib/lesta';
import type { TotalsStatsInput } from '../stats-block.types';

import { statsBlockFromRating, statsBlockFromTotals, totalsFromLestaBlock } from '../stats-block';

const TOTALS: TotalsStatsInput = {
  battles: 200,
  wins: 110,
  damageDealt: 400_000,
  frags: 180,
  spotted: 220,
  xp: 160_000,
  survived: 60,
  hits: 1500,
  shots: 2000,
  avgBlocked: 350,
  avgAssisted: 700,
  avgTier: 8.4,
  wn8: 1800,
  eff: 1400,
  broneIndex: 60
};

const LESTA_BLOCK: BattleStatsBlock = {
  battles: 10,
  wins: 6,
  losses: 4,
  draws: 0,
  xp: 9000,
  damage_dealt: 20_000,
  damage_received: 15_000,
  frags: 8,
  spotted: 11,
  capture_points: 0,
  dropped_capture_points: 3,
  hits: 70,
  shots: 90,
  survived_battles: 4
};

describe('statsBlockFromTotals', () => {
  it('derives per-battle averages and percentages from the totals', () => {
    const block = statsBlockFromTotals(TOTALS);

    expect(block.battles).toBe(TOTALS.battles);
    expect(block.winRate).toBeCloseTo((TOTALS.wins * 100) / TOTALS.battles);
    expect(block.avgDamage).toBeCloseTo(TOTALS.damageDealt / TOTALS.battles);
    expect(block.survivalRate).toBeCloseTo((60 * 100) / TOTALS.battles);
    expect(block.accuracy).toBeCloseTo((1500 * 100) / 2000);
    expect(block.wn8.value).toBe(TOTALS.wn8);
  });

  it('returns an empty block for zero battles', () => {
    const block = statsBlockFromTotals({ ...TOTALS, battles: 0 });

    expect(block).toMatchObject({ battles: 0, winRate: null, avgDamage: null, accuracy: null, avgTier: null });
    expect(block.wn8).toEqual({ value: null, tier: null });
  });

  it('keeps optional fields null when Lesta did not send them', () => {
    const block = statsBlockFromTotals({ battles: 5, wins: 2, damageDealt: 5000, frags: 3, spotted: 1 });

    expect(block).toMatchObject({ avgXp: null, survivalRate: null, accuracy: null, avgBlocked: null, avgAssisted: null });
    expect(block.eff).toEqual({ value: null, tier: null });
  });

  it('leaves accuracy null without shots rather than dividing by zero', () => {
    expect(statsBlockFromTotals({ ...TOTALS, hits: 0, shots: 0 }).accuracy).toBeNull();
  });

  it('floors negative averages at zero', () => {
    const block = statsBlockFromTotals({ ...TOTALS, damageDealt: -100, avgBlocked: -5 });

    expect(block.avgDamage).toBe(0);
    expect(block.avgBlocked).toBe(0);
  });

  it('drops an average tier outside the game range', () => {
    expect(statsBlockFromTotals({ ...TOTALS, avgTier: 0 }).avgTier).toBeNull();
    expect(statsBlockFromTotals({ ...TOTALS, avgTier: 12 }).avgTier).toBeNull();
    expect(statsBlockFromTotals({ ...TOTALS, avgTier: 1 }).avgTier).toBe(1);
    expect(statsBlockFromTotals({ ...TOTALS, avgTier: 11 }).avgTier).toBe(11);
  });

  it('treats a non-finite rating as missing', () => {
    expect(statsBlockFromTotals({ ...TOTALS, wn8: Number.NaN }).wn8.value).toBeNull();
  });
});

describe('statsBlockFromRating', () => {
  it('keeps the rating averages and leaves totals-only fields empty', () => {
    const block = statsBlockFromRating({ battles: 50, winRate: 52, avgDamage: 1800, avgFrags: 0.9, avgXp: 700, wn8: 1500 });

    expect(block).toMatchObject({ battles: 50, winRate: 52, avgDamage: 1800, avgFrags: 0.9, avgXp: 700 });
    expect(block).toMatchObject({ avgSpotted: null, survivalRate: null, accuracy: null });
    expect(block.wn8.value).toBe(1500);
  });

  it('clamps an out-of-range win rate', () => {
    expect(statsBlockFromRating({ battles: 1, winRate: 140, avgDamage: 0, avgFrags: 0 }).winRate).toBeLessThanOrEqual(100);
  });

  it('returns an empty block for zero battles', () => {
    expect(statsBlockFromRating({ battles: 0, winRate: 50, avgDamage: 1000, avgFrags: 1 })).toEqual(statsBlockFromTotals({ ...TOTALS, battles: 0 }));
  });
});

describe('totalsFromLestaBlock', () => {
  it('returns zero totals for a missing block', () => {
    const totals = totalsFromLestaBlock(undefined);

    expect(totals.battles).toBe(0);
    expect(statsBlockFromTotals(totals).battles).toBe(0);
  });

  it('maps the Lesta block so the stats block reproduces its ratios', () => {
    const block = statsBlockFromTotals(totalsFromLestaBlock(LESTA_BLOCK));

    expect(block.battles).toBe(LESTA_BLOCK.battles);
    expect(block.avgDamage).toBeCloseTo(LESTA_BLOCK.damage_dealt / LESTA_BLOCK.battles);
    expect(block.survivalRate).toBeCloseTo((LESTA_BLOCK.survived_battles * 100) / LESTA_BLOCK.battles);
    expect(block.accuracy).toBeCloseTo((LESTA_BLOCK.hits * 100) / LESTA_BLOCK.shots);
  });

  it('keeps blocked and assisted damage null when Lesta omits them', () => {
    expect(totalsFromLestaBlock(LESTA_BLOCK)).toMatchObject({ avgBlocked: null, avgAssisted: null });
    expect(totalsFromLestaBlock({ ...LESTA_BLOCK, avg_damage_blocked: 0 }).avgBlocked).toBe(0);
  });
});
