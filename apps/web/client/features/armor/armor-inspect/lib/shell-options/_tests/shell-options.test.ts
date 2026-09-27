import type { ArmorGunModuleData, ArmorShellOptionData } from '@otmetki/schemas';

import { penetrationAtDistance } from '@otmetki/gamedata';
import { describe, expect, it } from 'vitest';

import { pickShell, resolveShell } from '../shell-options';

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
