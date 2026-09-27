import { describe, expect, it } from 'vitest';

import type { InsightTank } from '../insights.types';

import { computeInsights } from '../insights';
import { INSIGHTS } from '../insights.constants';

const tank = (overrides: Partial<InsightTank> & Pick<InsightTank, 'tankId'>): InsightTank => ({
  type: 'heavyTank',
  tier: 10,
  battles: INSIGHTS.minTotalBattles,
  winRate: 50,
  avgDamage: 2000,
  serverWinRate: 50,
  serverAvgDamage: 2000,
  ...overrides
});

describe('computeInsights', () => {
  it('ignores tanks below the minimum battle count', () => {
    const insights = computeInsights({
      tanks: [tank({ tankId: 1, battles: 9 }), tank({ tankId: 2, battles: 10 })],
      minBattles: 10
    });

    expect(insights.battles).toBe(10);
    expect(insights.weakTanks.map((entry) => entry.tankId)).toEqual([2]);
  });

  it('asks for more battles before giving any other tip', () => {
    const insights = computeInsights({
      tanks: [tank({ tankId: 1, battles: INSIGHTS.minTotalBattles - 1, winRate: 30 })],
      minBattles: 1
    });

    expect(insights.tips).toEqual([
      { code: 'not_enough_battles', params: { battles: INSIGHTS.minTotalBattles - 1, required: INSIGHTS.minTotalBattles } }
    ]);
  });

  it('gives tips once the total reaches the minimum exactly', () => {
    const insights = computeInsights({ tanks: [tank({ tankId: 1, battles: INSIGHTS.minTotalBattles })], minBattles: 1 });

    expect(insights.tips.map((tip) => tip.code)).not.toContain('not_enough_battles');
  });

  it('reports no weak spots when every group plays at server level', () => {
    const insights = computeInsights({ tanks: [tank({ tankId: 1 }), tank({ tankId: 2, type: 'mediumTank' })], minBattles: 1 });

    expect(insights.tips).toEqual([{ code: 'no_weak_spots', params: {} }]);
  });

  it('flags the class, tier and tank that fall behind the server', () => {
    const insights = computeInsights({
      tanks: [
        tank({ tankId: 1, type: 'SPG', tier: 8, winRate: 50 - INSIGHTS.weakWinRateDelta, avgDamage: 1000 }),
        tank({ tankId: 2, type: 'heavyTank', tier: 10 })
      ],
      minBattles: 1
    });

    expect(insights.tips).toEqual([
      { code: 'weak_class', params: { type: 'SPG', winRateDelta: -INSIGHTS.weakWinRateDelta } },
      { code: 'weak_tier', params: { tier: 8, winRateDelta: -INSIGHTS.weakWinRateDelta } },
      { code: 'low_damage_tank', params: { tankId: 1, damageRatio: 0.5 } }
    ]);
  });

  it('does not flag a damage shortfall exactly at the tolerance', () => {
    const insights = computeInsights({
      tanks: [tank({ tankId: 1, avgDamage: 2000 * (1 - INSIGHTS.weakDamageShortfall) })],
      minBattles: 1
    });

    expect(insights.tips.map((tip) => tip.code)).toEqual(['no_weak_spots']);
  });

  it('leaves ratios empty when the server has no reference for the tank', () => {
    const insights = computeInsights({
      tanks: [tank({ tankId: 1, serverWinRate: null, serverAvgDamage: null })],
      minBattles: 1
    });

    expect(insights.weakTanks[0]).toMatchObject({ winRateDelta: null, damageRatio: null });
    expect(insights.byClass[0]).toMatchObject({ serverWinRate: null, winRateDelta: null, damageRatio: null });
  });

  it('treats a zero server damage as no reference rather than dividing by it', () => {
    const insights = computeInsights({ tanks: [tank({ tankId: 1, serverAvgDamage: 0 })], minBattles: 1 });

    expect(insights.weakTanks[0]?.damageRatio).toBeNull();
  });

  it('weights group win rates by battles played', () => {
    const insights = computeInsights({
      tanks: [tank({ tankId: 1, battles: 300, winRate: 60 }), tank({ tankId: 2, battles: 100, winRate: 40 })],
      minBattles: 1
    });

    expect(insights.byClass[0]?.winRate).toBeCloseTo((300 * 60 + 100 * 40) / 400);
    expect(insights.byClass[0]?.battles).toBe(400);
  });

  it('orders groups from the weakest win-rate delta up', () => {
    const insights = computeInsights({
      tanks: [
        tank({ tankId: 1, type: 'lightTank', winRate: 55 }),
        tank({ tankId: 2, type: 'SPG', winRate: 45 }),
        tank({ tankId: 3, type: 'heavyTank', winRate: 50 })
      ],
      minBattles: 1
    });

    expect(insights.byClass.map((group) => group.key)).toEqual(['SPG', 'heavyTank', 'lightTank']);
  });

  it('lists the weakest tanks first and the strongest tanks best-first', () => {
    const tanks = Array.from({ length: INSIGHTS.tanksShown + 2 }, (_, index) => tank({ tankId: index + 1, avgDamage: 1000 + index * 200 }));
    const insights = computeInsights({ tanks, minBattles: 1 });

    expect(insights.weakTanks).toHaveLength(INSIGHTS.tanksShown);
    expect(insights.strongTanks).toHaveLength(INSIGHTS.tanksShown);
    expect(insights.weakTanks[0]?.tankId).toBe(1);
    expect(insights.strongTanks[0]?.tankId).toBe(tanks.length);
  });

  it('returns empty groups and lists for no tanks', () => {
    const insights = computeInsights({ tanks: [], minBattles: 1 });

    expect(insights).toMatchObject({ battles: 0, byClass: [], byTier: [], weakTanks: [], strongTanks: [] });
    expect(insights.tips[0]?.code).toBe('not_enough_battles');
  });
});
