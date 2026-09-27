import type { ArmorGunModuleData, ArmorModulesData } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { resolveSelection } from '../select-modules';

const gun = (name: string): ArmorGunModuleData => ({ name, displayName: name, piece: 'Gun_01', plates: [], shells: [] });

const MODULES: ArmorModulesData = {
  hull: { piece: 'Hull', plates: [] },
  chassis: [],
  turrets: [
    { name: 'stock', displayName: 'stock', piece: 'Turret_01', plates: [], guns: [gun('a'), gun('b')] },
    { name: 'top', displayName: 'top', piece: 'Turret_02', plates: [], guns: [gun('b'), gun('c')] }
  ]
};

describe('resolveSelection', () => {
  it('starts on the top turret and its top gun', () => {
    const { turret, gun: selected } = resolveSelection({ modules: MODULES });

    expect(turret?.name).toBe('top');
    expect(selected?.name).toBe('c');
  });

  it('keeps an explicit choice that exists', () => {
    const { turret, gun: selected } = resolveSelection({ modules: MODULES, turretName: 'stock', gunName: 'a' });

    expect(turret?.name).toBe('stock');
    expect(selected?.name).toBe('a');
  });

  it('falls back to the turret top gun when the chosen gun does not fit that turret', () => {
    expect(resolveSelection({ modules: MODULES, turretName: 'top', gunName: 'a' }).gun?.name).toBe('c');
  });

  it('returns nothing to select on a vehicle without turrets', () => {
    expect(resolveSelection({ modules: { ...MODULES, turrets: [] } })).toEqual({ turret: undefined, gun: undefined });
  });
});
