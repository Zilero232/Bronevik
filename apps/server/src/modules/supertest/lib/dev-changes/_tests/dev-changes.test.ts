import type { ShellStats, VehicleStats } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { changeVerdict } from '../../change-verdict';
import { devChanges, devNewVehicleChanges } from '../dev-changes';

const SHELL: ShellStats = {
  shell: 'ap',
  kind: 'ARMOR_PIERCING',
  caliber: 130,
  isPremium: false,
  damage: 490,
  penetration100m: 250,
  penetration500m: 240,
  speed: 800,
  explosionRadius: null,
  damagePerMinute: 2100
};

const STATS: VehicleStats = {
  modules: {},
  maxHealth: 2400,
  weight: 68,
  enginePower: 1050,
  powerToWeight: 15.4,
  speedForward: 50,
  speedBackward: 16,
  hullTraverse: 26,
  turretTraverse: 22,
  viewRange: 400,
  radioRange: 850,
  reloadTime: 14.1,
  rateOfFire: 4.25,
  aimingTime: 2.4,
  dispersion: 0.4,
  dispersionMovement: 0.2,
  dispersionHullRotation: 0.2,
  dispersionTurretRotation: 0.1,
  elevation: 15,
  depression: 7,
  clip: null,
  shell: SHELL,
  shells: [SHELL]
};

describe('devChanges', () => {
  it('starts every change from the live value', () => {
    const changes = devChanges({ stats: STATS, variant: 0 });

    expect(changes.find((change) => change.param === 'reloadTime')?.from).toBe(STATS.reloadTime);
    expect(changes.find((change) => change.param === 'maxHealth')?.from).toBe(STATS.maxHealth);
  });

  it('mixes buffs and nerfs within one plan', () => {
    const verdicts = devChanges({ stats: STATS, variant: 0 }).map((change) => changeVerdict({ ...change, live: null }));

    expect(verdicts).toContain('buff');
    expect(verdicts).toContain('nerf');
  });

  it('cycles through the plans by variant', () => {
    const first = devChanges({ stats: STATS, variant: 1 }).map((change) => change.param);
    const cycled = devChanges({ stats: STATS, variant: 4 }).map((change) => change.param);

    expect(cycled).toEqual(first);
  });

  it('writes the raw line in the announcement format with decimal commas', () => {
    const reload = devChanges({ stats: STATS, variant: 0 }).find((change) => change.param === 'reloadTime');

    expect(reload?.raw).toMatch(/^Время перезарядки: 14,1 → \d+,\d+$/u);
  });

  it('skips parameters the vehicle has no live value for', () => {
    const changes = devChanges({ stats: { ...STATS, viewRange: 0 }, variant: 1 });

    expect(changes.map((change) => change.param)).not.toContain('viewRange');
  });
});

describe('devNewVehicleChanges', () => {
  it('lists characteristics with no previous value', () => {
    expect(devNewVehicleChanges().every((change) => change.from === null && change.to !== null)).toBe(true);
  });
});
