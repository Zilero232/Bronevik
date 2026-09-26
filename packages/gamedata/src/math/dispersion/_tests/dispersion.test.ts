import { describe, expect, it } from 'vitest';

import type { GunHandling } from '../dispersion.types';

import { aimCurve, aimTime, aimTimeline, dispersionAfter, dispersionFactor, handlingScore, scenarioAims } from '../dispersion';

const handling: GunHandling = {
  aimingTime: 2,
  dispersion: 0.35,
  dispersionAfterShot: 4,
  dispersionHullRotation: 0.1,
  dispersionMovement: 0.1,
  dispersionTurretRotation: 0.08,
  hullTraverse: 40,
  speedForward: 50,
  turretTraverse: 40
};

describe('dispersionFactor', () => {
  it('is exactly one when standing still', () => {
    expect(dispersionFactor({ handling, motion: {} })).toBe(1);
  });

  it('adds every source in quadrature', () => {
    const move = dispersionFactor({ handling, motion: { speed: 30 } });
    const turret = dispersionFactor({ handling, motion: { turretRotation: 30 } });
    const both = dispersionFactor({ handling, motion: { speed: 30, turretRotation: 30 } });

    expect(both ** 2 - 1).toBeCloseTo(move ** 2 - 1 + (turret ** 2 - 1));
    expect(both).toBeLessThan(move + turret);
  });

  it('grows with speed', () => {
    expect(dispersionFactor({ handling, motion: { speed: 40 } })).toBeGreaterThan(dispersionFactor({ handling, motion: { speed: 20 } }));
  });
});

describe('aim convergence', () => {
  it('reaches the base dispersion exactly after the aim time and stays there', () => {
    const motion = { speed: 40 };
    const time = aimTime({ handling, motion });

    expect(dispersionAfter({ handling, motion, elapsed: time })).toBeCloseTo(handling.dispersion);
    expect(dispersionAfter({ handling, motion, elapsed: time * 2 })).toBe(handling.dispersion);
    expect(dispersionAfter({ handling, motion, elapsed: time / 2 })).toBeGreaterThan(handling.dispersion);
  });

  it('shrinks the circle by e every aiming time', () => {
    const motion = { speed: 50, turretRotation: 40 };
    const start = dispersionAfter({ handling, motion, elapsed: 0 });

    expect(dispersionAfter({ handling, motion, elapsed: handling.aimingTime })).toBeCloseTo(start / Math.E);
  });

  it('builds a non-increasing curve over the timeline', () => {
    const points = aimCurve({ handling, motion: { isShot: true }, times: aimTimeline(handling) });

    for (const [index, point] of points.entries()) {
      expect(point.dispersion).toBeLessThanOrEqual(points[index - 1]?.dispersion ?? Infinity);
    }

    expect(points.at(-1)?.dispersion).toBe(handling.dispersion);
  });

  it('makes the combined scenario the slowest to aim', () => {
    const aims = scenarioAims(handling);
    const full = aims.find((item) => item.scenario === 'full');
    const move = aims.find((item) => item.scenario === 'move');

    expect(full?.aimTime).toBeGreaterThan(move?.aimTime ?? Infinity);
  });

  it('scores a faster-aiming gun better', () => {
    expect(handlingScore({ ...handling, aimingTime: 1.5 })).toBeLessThan(handlingScore(handling));
  });
});
