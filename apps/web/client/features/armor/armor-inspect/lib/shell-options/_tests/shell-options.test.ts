import type { ArmorGunModuleData, ArmorShellOptionData } from '@otmetki/schemas';

import { penetrationAtDistance } from '@otmetki/gamedata';
import { describe, expect, it } from 'vitest';

import { ARMOR_INSPECT } from '../../../config';
import { clampDistance, pickGun, pickShell, resolveShell } from '../shell-options';

const shell = (name: string, kind: string): ArmorShellOptionData => ({
  name,
  displayName: name,
  kind,
  caliber: 130,
  damage: 490,
  penetration: { at100m: 250, at500m: 220 },
  isPremium: false
});

const GUN: ArmorGunModuleData = {
  name: 'S-70',
  displayName: 'S-70',
  piece: 'Gun_01',
  plates: [],
  shells: [shell('ap', 'ARMOR_PIERCING'), shell('heat', 'HOLLOW_CHARGE'), shell('old', 'ARMOR_PIERCING_HE')]
};

describe('pickShell', () => {
  it('defaults to the first shell of the gun', () => {
    expect(pickShell({ gun: GUN })?.name).toBe('ap');
  });

  it('keeps a chosen shell and falls back when the gun does not carry it', () => {
    expect(pickShell({ gun: GUN, shellName: 'heat' })?.name).toBe('heat');
    expect(pickShell({ gun: GUN, shellName: 'missing' })?.name).toBe('ap');
  });

  it('returns nothing without a gun', () => {
    expect(pickShell({ gun: undefined })).toBeUndefined();
  });
});

describe('resolveShell', () => {
  it('applies the distance falloff to AP', () => {
    const [ap] = GUN.shells;

    expect(resolveShell({ option: ap, distance: 300 }).penetration).toBe(
      penetrationAtDistance({ kind: 'ARMOR_PIERCING', ...ap.penetration, distance: 300 })
    );
  });

  it('keeps HEAT penetration at any distance', () => {
    const heat = GUN.shells[1];

    expect(resolveShell({ option: heat, distance: 500 }).penetration).toBe(heat.penetration.at100m);
  });

  it('maps a legacy kind onto a kind the math knows', () => {
    expect(resolveShell({ option: GUN.shells[2], distance: 0 }).kind).toBe('ARMOR_PIERCING');
  });
});

describe('pickGun', () => {
  const guns = [
    { name: 'stock', displayName: 'Stock', shells: GUN.shells },
    { name: 'top', displayName: 'Top', shells: GUN.shells }
  ];

  it('keeps the chosen gun', () => {
    expect(pickGun({ guns, gunName: 'stock' })?.name).toBe('stock');
  });

  it('falls back to the last (top) gun when the chosen one is gone or unset', () => {
    expect(pickGun({ guns, gunName: 'gone' })?.name).toBe('top');
    expect(pickGun({ guns, gunName: null })?.name).toBe('top');
  });

  it('returns nothing for a vehicle without guns', () => {
    expect(pickGun({ guns: [] })).toBeUndefined();
  });
});

describe('clampDistance', () => {
  it('keeps a distance from the URL inside the slider range', () => {
    expect(clampDistance(ARMOR_INSPECT.distance.max + 100)).toBe(ARMOR_INSPECT.distance.max);
    expect(clampDistance(ARMOR_INSPECT.distance.min - 1)).toBe(ARMOR_INSPECT.distance.min);
    expect(clampDistance(ARMOR_INSPECT.distance.initial)).toBe(ARMOR_INSPECT.distance.initial);
  });
});
