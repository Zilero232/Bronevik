import type { PopularBuild, ProvisionOption } from '@bronevik/schemas';

import { LOADOUT } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { popularLoadout } from '../popular-loadout';

const option = (id: number): ProvisionOption => ({
  id,
  tag: `item_${id}`,
  name: `item ${id}`,
  kind: 'optionalDevice',
  variant: null,
  group: null,
  image: null,
  price: null,
  categories: [],
  effects: []
});

const BUILD: PopularBuild = {
  optionalDevices: [option(1), option(2)],
  consumables: [option(3)],
  directives: [],
  battles: 10,
  share: 0.5,
  winRate: 52,
  avgDamage: 2_000
};

describe('popularLoadout', () => {
  it('installs the build items in slot order and pads the rest with empty slots', () => {
    const loadout = popularLoadout(BUILD);

    expect(loadout.equipment).toHaveLength(LOADOUT.equipmentSlots);
    expect(loadout.equipment.slice(0, 2)).toEqual([1, 2]);
    expect(loadout.equipment.slice(2).every((id) => id === null)).toBe(true);
    expect(loadout.consumables[0]).toBe(3);
  });

  it('leaves modules, crew and field modifications untouched', () => {
    const loadout = popularLoadout(BUILD);

    expect(loadout.profileId).toBeUndefined();
    expect(loadout.crewSkills).toEqual({});
    expect(loadout.fieldModifications).toEqual([]);
  });
});
