import type { ShellStats, VehicleStats } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { liveValue } from '../live-value';

const AP: ShellStats = {
  shell: 'ap',
  kind: 'ARMOR_PIERCING',
  caliber: 122,
  isPremium: false,
  damage: 390,
  penetration100m: 258,
  penetration500m: 248,
  speed: 900,
  explosionRadius: null,
  damagePerMinute: 2020
};

const APCR: ShellStats = { ...AP, shell: 'apcr', kind: 'ARMOR_PIERCING_CR', isPremium: true, penetration100m: 310, speed: 1125 };

const STATS: VehicleStats = {
  modules: {},
  maxHealth: 2400,
  weight: 68.5,
  enginePower: 1050,
  powerToWeight: 15.3,
  speedForward: 50,
  speedBackward: 16,
  hullTraverse: 26,
  turretTraverse: 22,
  viewRange: 400,
  radioRange: 850,
  reloadTime: 11.6,
  rateOfFire: 5.17,
  aimingTime: 2.3,
  dispersion: 0.38,
  dispersionMovement: 0.2,
  dispersionHullRotation: 0.2,
  dispersionTurretRotation: 0.1,
  elevation: 20,
  depression: -7,
  clip: { count: 3, interval: 2.5, reloadTime: 30 },
  shell: AP,
  shells: [AP, APCR]
};

describe('liveValue', () => {
  it('reads plain characteristics straight from the top configuration', () => {
    expect(liveValue({ param: 'reloadTime', label: 'Время перезарядки', stats: STATS })).toBe(STATS.reloadTime);
    expect(liveValue({ param: 'maxHealth', label: 'Прочность', stats: STATS })).toBe(STATS.maxHealth);
  });

  it('reads the standard shell when the label names no shell type', () => {
    expect(liveValue({ param: 'shellPenetration', label: 'Бронепробиваемость', stats: STATS })).toBe(AP.penetration100m);
  });

  it('reads the named shell when the label names one', () => {
    expect(liveValue({ param: 'shellPenetration', label: 'Бронепробиваемость подкалиберным снарядом', stats: STATS })).toBe(APCR.penetration100m);
  });

  it('returns null when the named shell is not in the loadout', () => {
    expect(liveValue({ param: 'shellDamage', label: 'Урон фугасным снарядом', stats: STATS })).toBeNull();
  });

  it('reports gun angles as positive magnitudes', () => {
    expect(liveValue({ param: 'depression', label: 'Угол склонения', stats: STATS })).toBe(Math.abs(STATS.depression ?? 0));
  });

  it('reads the magazine reload of a clip gun', () => {
    expect(liveValue({ param: 'clipReloadTime', label: 'Перезарядка кассеты', stats: STATS })).toBe(STATS.clip?.reloadTime);
  });

  it('returns null without stats, without a parameter or for armour', () => {
    expect(liveValue({ param: 'reloadTime', label: 'Перезарядка', stats: null })).toBeNull();
    expect(liveValue({ param: null, label: 'Что-то', stats: STATS })).toBeNull();
    expect(liveValue({ param: 'armorHullFront', label: 'Бронирование лба', stats: STATS })).toBeNull();
  });
});
