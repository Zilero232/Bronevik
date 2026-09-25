import { moeDamageForPercent, projectMoeBattles } from '@bronevik/ratings';
import { describe, expect, it } from 'vitest';

import { MOE_PROJECTION } from '../../../config';
import { curveLength, projectionCurve } from '../moe-curve';

const THRESHOLDS = { oneMark: 2_000, twoMarks: 2_600, threeMarks: 3_000, hundredPercent: 3_600 };

describe('curveLength', () => {
  it('runs a little past the projected battle so the crossing is visible', () => {
    const battles = 200;

    expect(curveLength(battles)).toBeGreaterThan(battles);
  });

  it('stays within the configured window', () => {
    expect(curveLength(1)).toBe(MOE_PROJECTION.minBattles);
    expect(curveLength(1_000_000)).toBe(MOE_PROJECTION.maxBattles);
  });

  it('falls back to a default horizon when the mark is out of reach', () => {
    expect(curveLength(null)).toBe(curveLength(MOE_PROJECTION.fallbackBattles));
  });
});

describe('projectionCurve', () => {
  const averageDamage = moeDamageForPercent({ percent: 97, thresholds: THRESHOLDS });
  const { battles } = projectMoeBattles({ currentPercent: 70, targetPercent: 95, averageCombinedDamage: averageDamage, thresholds: THRESHOLDS });
  const curve = projectionCurve({ currentPercent: 70, averageDamage, thresholds: THRESHOLDS, battlesNeeded: battles });

  it('starts at the current percent before the first battle', () => {
    expect(curve[0]).toEqual({ battle: 0, percent: 70 });
  });

  it('keeps the chart to a bounded number of points', () => {
    expect(curve.length).toBeLessThanOrEqual(MOE_PROJECTION.maxPoints + 2);
  });

  it('crosses the target percent around the projected battle', () => {
    const crossing = curve.find(({ percent }) => percent >= 95);

    expect(crossing).toBeDefined();
    expect(crossing?.battle).toBeGreaterThanOrEqual(battles ?? 0);
  });

  it('never climbs above the percent the average damage settles at', () => {
    expect(Math.max(...curve.map(({ percent }) => percent))).toBeLessThanOrEqual(97);
  });
});
