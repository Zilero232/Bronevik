import { describe, expect, it } from 'vitest';

import type { TankMathShell } from '../../../api';

import { TANK_MATH } from '../../../config';
import { ballisticsSeries, shellRows } from '../ballistics-view';

const ap: TankMathShell = {
  shell: 'ap',
  kind: 'ARMOR_PIERCING',
  caliber: 100,
  isPremium: false,
  damage: 320,
  speed: 1000,
  gravity: 9.81,
  maxDistance: 720,
  penetration100m: 250,
  penetration500m: 240
};

const heat: TankMathShell = { ...ap, shell: 'heat', kind: 'HOLLOW_CHARGE', isPremium: true, speed: 800, penetration100m: 330, penetration500m: 330 };

describe('ballisticsSeries', () => {
  it('samples every shell on one distance grid', () => {
    const series = ballisticsSeries([ap, heat]);

    expect(series.penetration).toHaveLength(2);
    expect(series.flightTime.every((item) => item.values.length === series.distances.length)).toBe(true);
    expect(series.distances.at(-1)).toBeLessThanOrEqual(ap.maxDistance);
  });
});

describe('shellRows', () => {
  it('compares every shell with the first one', () => {
    const [first, second] = shellRows([ap, heat]);

    expect(first?.penetrationDelta).toBeNull();
    expect(second?.penetration).toHaveLength(TANK_MATH.penetrationDistances.length);
    expect(second?.penetrationDelta?.every((delta) => delta > 0)).toBe(true);
    expect(second?.flightTimeDelta).toBeGreaterThan(0);
  });
});
