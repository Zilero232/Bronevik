import type { VehicleStats } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { TANK_SPEC_KEYS } from '../../../config';
import { specKeyOfPath, specPath, specsOfFlat, specsOfStats } from '../vehicle-specs';

const SHELL = {
  shell: 'AP',
  kind: 'ARMOR_PIERCING',
  caliber: 100,
  isPremium: false,
  damage: 320,
  penetration100m: 210,
  penetration500m: 200,
  speed: 900,
  explosionRadius: null,
  damagePerMinute: 2_400
};

const STATS: VehicleStats = {
  modules: {},
  maxHealth: 1_500,
  weight: 40,
  enginePower: 600,
  powerToWeight: 15,
  speedForward: 50,
  speedBackward: 20,
  hullTraverse: 40,
  turretTraverse: 38,
  viewRange: 390,
  radioRange: 700,
  reloadTime: 8,
  rateOfFire: 7.5,
  aimingTime: 2,
  dispersion: 0.35,
  dispersionMovement: 0.2,
  dispersionHullRotation: 0.2,
  dispersionTurretRotation: 0.1,
  elevation: 20,
  depression: 8,
  clip: null,
  shell: SHELL,
  shells: [SHELL]
};

describe('specsOfStats', () => {
  it('fills every spec the client shows', () => {
    const specs = specsOfStats(STATS);

    expect(TANK_SPEC_KEYS.every((key) => typeof specs[key] === 'number')).toBe(true);
  });

  it('reads the shell specs from the standard shell', () => {
    expect(specsOfStats(STATS).shellDamage).toBe(SHELL.damage);
  });

  it('has nothing to show without stats', () => {
    expect(specsOfStats(null)).toEqual({});
  });
});

describe('specsOfFlat', () => {
  it('reads each spec from the path the compare endpoint flattens it to', () => {
    const flat = Object.fromEntries(TANK_SPEC_KEYS.map((key, index) => [specPath(key), index]));
    const specs = specsOfFlat(flat);

    expect(TANK_SPEC_KEYS.map((key) => specs[key])).toEqual(TANK_SPEC_KEYS.map((_, index) => index));
  });
});

describe('specKeyOfPath', () => {
  it('finds the spec behind a profile-prefixed patch path', () => {
    expect(TANK_SPEC_KEYS.every((key) => specKeyOfPath(`top.${specPath(key)}`) === key)).toBe(true);
  });

  it('leaves an unknown path unmatched', () => {
    expect(specKeyOfPath('guns.T1/Gun.shells.AP.damage')).toBeUndefined();
  });
});
