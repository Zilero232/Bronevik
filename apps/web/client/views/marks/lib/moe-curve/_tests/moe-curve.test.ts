import type { MoeThreshold } from '@otmetki/schemas';

import { MOE_CURVE } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { curveEntries, defaultCurvePercent } from '../moe-curve';

const THRESHOLDS: MoeThreshold = { tankId: 1, date: '2026-09-28', source: 'poliroid', p65: 2_000, p85: 2_600, p95: 3_100, p100: null };

const point = (percent: number, damage: number) => ({ percent, damage, players: MOE_CURVE.minPlayers, battles: 50 });

describe('curveEntries', () => {
  it('lists only the thresholds that exist when no mod player reported', () => {
    const entries = curveEntries({ thresholds: THRESHOLDS, points: [] });

    expect(entries.map(({ percent }) => percent)).toEqual([65, 85, 95]);
    expect(entries.every(({ source }) => source === 'threshold')).toBe(true);
  });

  it('keeps the official threshold over a mod estimate at the same percent', () => {
    const entries = curveEntries({ thresholds: THRESHOLDS, points: [point(65, 1_900), point(70, 2_150)] });

    expect(entries.find(({ percent }) => percent === 65)).toMatchObject({ damage: THRESHOLDS.p65, source: 'threshold' });
    expect(entries.find(({ percent }) => percent === 70)).toMatchObject({ damage: 2_150, source: 'mod' });
  });

  it('never adds a percent that neither the thresholds nor the mod reported', () => {
    const entries = curveEntries({ thresholds: null, points: [point(50, 1_500), point(60, 1_800)] });

    expect(entries.map(({ percent }) => percent)).toEqual([50, 60]);
  });
});

describe('defaultCurvePercent', () => {
  it('starts from the third mark when it is known', () => {
    expect(defaultCurvePercent(curveEntries({ thresholds: THRESHOLDS, points: [] }))).toBe(95);
  });

  it('falls back to the highest reported percent, and to nothing without data', () => {
    expect(defaultCurvePercent(curveEntries({ thresholds: null, points: [point(50, 1_500), point(60, 1_800)] }))).toBe(60);
    expect(defaultCurvePercent([])).toBeNull();
  });
});
