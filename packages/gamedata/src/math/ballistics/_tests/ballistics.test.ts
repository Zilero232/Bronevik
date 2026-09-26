import { describe, expect, it } from 'vitest';

import type { BallisticShell } from '../ballistics.types';

import { ballisticsCurve, ballisticsDistances, flightTime, penetrationAt } from '../ballistics';

const ap: BallisticShell = { kind: 'ARMOR_PIERCING', penetration100m: 250, penetration500m: 240, speed: 1000, gravity: 9.81, maxDistance: 720 };
const heat: BallisticShell = { ...ap, kind: 'HOLLOW_CHARGE', penetration100m: 330, penetration500m: 330, speed: 900 };

describe('penetrationAt', () => {
  it('is flat before 100 m and after 500 m, linear in between', () => {
    expect(penetrationAt({ shell: ap, distance: 0 })).toBe(ap.penetration100m);
    expect(penetrationAt({ shell: ap, distance: 700 })).toBe(ap.penetration500m);
    expect(penetrationAt({ shell: ap, distance: 300 })).toBeCloseTo((ap.penetration100m + ap.penetration500m) / 2);
  });

  it('does not drop for HEAT even when the files list two values', () => {
    expect(penetrationAt({ shell: { ...heat, penetration500m: 300 }, distance: 500 })).toBe(heat.penetration100m);
  });
});

describe('flightTime', () => {
  it('is close to distance over speed for a flat trajectory and grows with distance', () => {
    const near = flightTime({ shell: ap, distance: 100 }) ?? 0;
    const far = flightTime({ shell: ap, distance: 500 }) ?? 0;

    expect(near).toBeGreaterThanOrEqual(100 / ap.speed);
    expect(near).toBeCloseTo(100 / ap.speed, 3);
    expect(far).toBeGreaterThan(near);
  });

  it('is slower for a slower shell', () => {
    expect(flightTime({ shell: heat, distance: 400 }) ?? 0).toBeGreaterThan(flightTime({ shell: ap, distance: 400 }) ?? 0);
  });

  it('is unknown past the maximum distance or out of ballistic reach', () => {
    expect(flightTime({ shell: ap, distance: ap.maxDistance + 1 })).toBeNull();
    expect(flightTime({ shell: { ...ap, speed: 50 }, distance: 500 })).toBeNull();
  });
});

describe('ballisticsCurve', () => {
  it('samples every distance of the grid', () => {
    const distances = ballisticsDistances(200);
    const curve = ballisticsCurve({ shell: ap, distances });

    expect(curve.map((point) => point.distance)).toEqual(distances);
    expect(distances[0]).toBe(0);
    expect(distances.at(-1)).toBe(200);
  });
});
