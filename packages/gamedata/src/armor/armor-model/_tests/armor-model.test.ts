import { describe, expect, it } from 'vitest';

import { listArmorGuns } from '../armor-model';

const SHELL = {
  name: 'ap',
  displayName: 'AP',
  kind: 'ARMOR_PIERCING',
  caliber: 100,
  damage: 300,
  penetration: { at100m: 200, at500m: 190 },
  isPremium: false
};

const gun = (name: string) => ({ name, displayName: name.toUpperCase(), piece: `Gun_${name}`, plates: [], shells: [SHELL] });

describe('listArmorGuns', () => {
  it('lists every gun once, in turret order, even when two turrets mount it', () => {
    const guns = listArmorGuns({ turrets: [{ guns: [gun('a'), gun('b')] }, { guns: [gun('b'), gun('c')] }] });

    expect(guns.map(({ name }) => name)).toEqual(['a', 'b', 'c']);
  });

  it('keeps only what an attacker needs', () => {
    const [first] = listArmorGuns({ turrets: [{ guns: [gun('a')] }] });

    expect(first).toEqual({ name: 'a', displayName: 'A', shells: [SHELL] });
  });

  it('returns nothing for a vehicle without turrets', () => {
    expect(listArmorGuns({ turrets: [] })).toEqual([]);
  });
});
