import type { GunHandling } from '@otmetki/gamedata';

import { describe, expect, it } from 'vitest';

import { HANDLING_ROWS } from '../../../config';
import { handlingCurves, handlingRows } from '../handling-view';

const handling: GunHandling = {
  aimingTime: 2.3,
  dispersion: 0.4,
  dispersionAfterShot: 4,
  dispersionHullRotation: 0.2,
  dispersionMovement: 0.2,
  dispersionTurretRotation: 0.1,
  hullTraverse: 40,
  speedForward: 50,
  turretTraverse: 40
};

describe('handlingCurves', () => {
  it('gives one curve per scenario sampled on the shared timeline, ending fully aimed', () => {
    const curves = handlingCurves(handling);

    for (const series of curves.series) {
      expect(series.values).toHaveLength(curves.times.length);
      expect(series.values.at(-1)).toBe(handling.dispersion);
    }
  });
});

describe('handlingRows', () => {
  it('lists every row and no deltas without a second configuration', () => {
    const rows = handlingRows({ handling });

    expect(rows.map((row) => row.id)).toEqual([...HANDLING_ROWS]);
    expect(rows.every((row) => row.delta === null)).toBe(true);
  });

  it('gives a negative aim-time delta to the faster-aiming configuration', () => {
    const rows = handlingRows({ handling: { ...handling, aimingTime: 1.9 }, other: handling });

    expect(rows.find((row) => row.id === 'aimingTime')?.delta).toBeLessThan(0);
    expect(rows.find((row) => row.id === 'aim.full')?.delta).toBeLessThan(0);
    expect(rows.find((row) => row.id === 'dispersion')?.delta).toBe(0);
  });
});
