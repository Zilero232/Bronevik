import { describe, expect, it } from 'vitest';

import type { MoeThresholds } from '..';

import { MOE, moeCombinedDamage, moeDamageForPercent, moeMarks, moePercentForDamage, projectMoeBattles, simulateMoe, toMoeThresholds } from '..';

const THRESHOLDS: MoeThresholds = { oneMark: 2400, twoMarks: 3100, threeMarks: 3700 };

describe('moe helpers', () => {
  it('adds the best of spotting, tracking and stun assist to damage', () => {
    expect(moeCombinedDamage({ damage: 2000, spottingAssist: 900, trackingAssist: 1200, stunAssist: 300 })).toBe(3200);
    expect(moeCombinedDamage({ damage: 2000, spottingAssist: 900, trackingAssist: 100 })).toBe(2900);
  });

  it('counts marks by threshold', () => {
    const [one, two, three] = MOE.markPercents;

    expect([0, one - 0.01, one, two, three, MOE.maxPercent].map(moeMarks)).toEqual([0, 0, 1, 2, 3, 3]);
  });

  it('maps mark percentages exactly onto the thresholds', () => {
    const [one, two, three] = MOE.markPercents;

    expect(moeDamageForPercent({ percent: one, thresholds: THRESHOLDS })).toBe(THRESHOLDS.oneMark);
    expect(moeDamageForPercent({ percent: two, thresholds: THRESHOLDS })).toBe(THRESHOLDS.twoMarks);
    expect(moeDamageForPercent({ percent: three, thresholds: THRESHOLDS })).toBe(THRESHOLDS.threeMarks);
  });

  it('inverts percent to damage and back', () => {
    for (const percent of [0, 12.5, 65, 70.3, 88, 95, 97.4, 100]) {
      const damage = moeDamageForPercent({ percent, thresholds: THRESHOLDS });

      expect(moePercentForDamage({ damage, thresholds: THRESHOLDS })).toBeCloseTo(percent, 8);
    }
  });

  it('rejects non-increasing thresholds', () => {
    expect(() => moeDamageForPercent({ percent: 50, thresholds: { oneMark: 3000, twoMarks: 2000, threeMarks: 4000 } })).toThrow(RangeError);
  });
});

describe('projectMoeBattles', () => {
  it('returns zero when the target is already reached', () => {
    expect(projectMoeBattles({ currentPercent: 90, targetPercent: 85, averageCombinedDamage: 1, thresholds: THRESHOLDS }).battles).toBe(0);
  });

  it('returns null when the average damage cannot reach the target', () => {
    expect(
      projectMoeBattles({ currentPercent: 60, targetPercent: 95, averageCombinedDamage: THRESHOLDS.threeMarks, thresholds: THRESHOLDS }).battles
    ).toBeNull();
  });

  it('agrees with a battle-by-battle simulation of the moving average', () => {
    const averageCombinedDamage = 3900;
    const { battles } = projectMoeBattles({ currentPercent: 70, targetPercent: 95, averageCombinedDamage, thresholds: THRESHOLDS });

    expect(battles).toBeGreaterThan(0);

    const path = simulateMoe({
      startPercent: 70,
      combinedDamages: Array.from<number>({ length: battles ?? 0 }).fill(averageCombinedDamage),
      thresholds: THRESHOLDS
    });

    expect(path.at(-1)).toBeGreaterThanOrEqual(95 - 1e-9);
    expect(path.at(-2)).toBeLessThan(95);
  });

  it('needs fewer battles with more damage', () => {
    const project = (averageCombinedDamage: number) =>
      projectMoeBattles({ currentPercent: 50, targetPercent: 85, averageCombinedDamage, thresholds: THRESHOLDS }).battles ?? Number.POSITIVE_INFINITY;

    expect(project(4500)).toBeLessThan(project(3500));
  });

  it('maps API percentile thresholds onto mark thresholds', () => {
    expect(toMoeThresholds({ p65: 2400, p85: 3100, p95: 3700, p100: 4300 })).toEqual({
      oneMark: 2400,
      twoMarks: 3100,
      threeMarks: 3700,
      hundredPercent: 4300
    });

    expect(toMoeThresholds({ p65: 2400, p85: 3100, p95: 3700, p100: null }).hundredPercent).toBeUndefined();
  });
});
