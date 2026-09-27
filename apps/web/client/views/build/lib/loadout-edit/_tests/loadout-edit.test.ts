import { describe, expect, it } from 'vitest';

import { emptyLoadout } from '@/entities/tank/build';

import type { BuildFieldStep, BuildModule } from '../../build-catalog';

import {
  chooseFieldMod,
  fieldModSide,
  moduleKeys,
  roleSkills,
  sameLoadout,
  selectedModules,
  setModule,
  setSlotItem,
  SLOT_SIZES,
  slotsOf,
  takenIds,
  toggleSkill
} from '..';

const item = (id: number) => ({
  id,
  tag: `mod_${id}`,
  name: `mod ${id}`,
  kind: 'optionalDevice' as const,
  image: null,
  category: null,
  isPremium: false
});

const FIELD_MODS: BuildFieldStep[] = [
  { key: 'mod_1|mod_2', level: 1, options: [item(1), item(2)] },
  { key: 'mod_3|mod_4', level: 2, options: [item(3), item(4)] }
];

const module = (id: number, rest: Omit<BuildModule, 'id' | 'key' | 'name' | 'turretId'> & { turretId?: number }): BuildModule => ({
  id,
  key: `key_${id}`,
  name: `module ${id}`,
  turretId: null,
  ...rest
});

const MODULES: BuildModule[] = [
  module(31, { slot: 'turret', tier: 9 }),
  module(32, { slot: 'turret', tier: 10 }),
  module(11, { slot: 'gun', tier: 9, turretId: 31 }),
  module(11, { slot: 'gun', tier: 9, turretId: 32 }),
  module(12, { slot: 'gun', tier: 10, turretId: 32 }),
  module(21, { slot: 'engine', tier: 9 }),
  module(22, { slot: 'engine', tier: 10 })
];

const MAX_SKILLS = 2;

describe('setSlotItem', () => {
  it('puts the item into the chosen slot', () => {
    const next = setSlotItem({ loadout: emptyLoadout(), field: 'equipment', slot: 1, id: 101 });

    expect(slotsOf({ loadout: next, field: 'equipment' })[1]).toBe(101);
  });

  it('moves an item out of its previous slot so it is never installed twice', () => {
    const first = setSlotItem({ loadout: emptyLoadout(), field: 'equipment', slot: 0, id: 101 });
    const moved = setSlotItem({ loadout: first, field: 'equipment', slot: 2, id: 101 });

    expect(slotsOf({ loadout: moved, field: 'equipment' }).filter((id) => id === 101)).toHaveLength(1);
  });

  it('pads a short slot list to the full slot count', () => {
    const short = { ...emptyLoadout(), directives: [301] };
    const next = setSlotItem({ loadout: short, field: 'directives', slot: SLOT_SIZES.directives - 1, id: 302 });

    expect(next.directives).toHaveLength(SLOT_SIZES.directives);
  });

  it('clears a slot when given null', () => {
    const filled = setSlotItem({ loadout: emptyLoadout(), field: 'consumables', slot: 0, id: 201 });
    const cleared = setSlotItem({ loadout: filled, field: 'consumables', slot: 0, id: null });

    expect(slotsOf({ loadout: cleared, field: 'consumables' })[0]).toBeNull();
  });
});

describe('takenIds', () => {
  it('lists the items of every other slot but not the slot being edited', () => {
    const first = setSlotItem({ loadout: emptyLoadout(), field: 'equipment', slot: 0, id: 101 });
    const loadout = setSlotItem({ loadout: first, field: 'equipment', slot: 1, id: 102 });

    expect(takenIds({ loadout, field: 'equipment', slot: 0 })).toEqual([102]);
  });
});

describe('toggleSkill', () => {
  it('adds a skill to a role with room left', () => {
    const next = toggleSkill({ loadout: emptyLoadout(), role: 'gunner', skillId: '404', max: MAX_SKILLS });

    expect(roleSkills({ loadout: next, role: 'gunner' })).toContain('404');
  });

  it('removes a skill that is already learned', () => {
    const learned = toggleSkill({ loadout: emptyLoadout(), role: 'gunner', skillId: '404', max: MAX_SKILLS });
    const forgotten = toggleSkill({ loadout: learned, role: 'gunner', skillId: '404', max: MAX_SKILLS });

    expect(roleSkills({ loadout: forgotten, role: 'gunner' })).not.toContain('404');
  });

  it('refuses a new skill once the role is full', () => {
    const full = Array.from({ length: MAX_SKILLS }, (_, index) => String(index + 1)).reduce(
      (loadout, skillId) => toggleSkill({ loadout, role: 'driver', skillId, max: MAX_SKILLS }),
      emptyLoadout()
    );

    const next = toggleSkill({ loadout: full, role: 'driver', skillId: 'extra', max: MAX_SKILLS });

    expect(roleSkills({ loadout: next, role: 'driver' })).toHaveLength(MAX_SKILLS);
  });

  it('leaves other roles untouched', () => {
    const next = toggleSkill({ loadout: { ...emptyLoadout(), crewSkills: { loader: ['410'] } }, role: 'gunner', skillId: '404', max: MAX_SKILLS });

    expect(roleSkills({ loadout: next, role: 'loader' })).toEqual(['410']);
  });
});

describe('chooseFieldMod', () => {
  it('keeps only one option per step', () => {
    const left = chooseFieldMod({ loadout: emptyLoadout(), steps: FIELD_MODS, tag: 'mod_1' });
    const right = chooseFieldMod({ loadout: left, steps: FIELD_MODS, tag: 'mod_2' });

    expect(right.fieldModifications).toEqual(['mod_2']);
  });

  it('deselects an option picked twice', () => {
    const once = chooseFieldMod({ loadout: emptyLoadout(), steps: FIELD_MODS, tag: 'mod_3' });

    expect(chooseFieldMod({ loadout: once, steps: FIELD_MODS, tag: 'mod_3' }).fieldModifications).toEqual([]);
  });

  it('keeps selections in tree order regardless of click order', () => {
    const late = chooseFieldMod({ loadout: emptyLoadout(), steps: FIELD_MODS, tag: 'mod_4' });

    expect(chooseFieldMod({ loadout: late, steps: FIELD_MODS, tag: 'mod_1' }).fieldModifications).toEqual(['mod_1', 'mod_4']);
  });

  it('ignores ids that belong to no step', () => {
    const loadout = emptyLoadout();

    expect(chooseFieldMod({ loadout, steps: FIELD_MODS, tag: 'mod_999' })).toBe(loadout);
  });

  it('reports which side of each step is chosen', () => {
    const loadout = chooseFieldMod({ loadout: emptyLoadout(), steps: FIELD_MODS, tag: 'mod_2' });

    expect(FIELD_MODS.map((step) => fieldModSide({ loadout, step }))).toEqual([1, null]);
  });
});

describe('selectedModules', () => {
  it('treats a loadout without modules as the top configuration', () => {
    expect(selectedModules({ loadout: emptyLoadout(), modules: MODULES })).toEqual({ turret: 32, gun: 12, engine: 22 });
  });

  it('swaps a single slot and keeps the rest', () => {
    const stockGun = setModule({ loadout: emptyLoadout(), modules: MODULES, slot: 'gun', moduleId: 11 });

    expect(selectedModules({ loadout: stockGun, modules: MODULES })).toEqual({ turret: 32, gun: 11, engine: 22 });
  });

  it('drops a gun the newly chosen turret cannot mount', () => {
    const stockTurret = setModule({ loadout: emptyLoadout(), modules: MODULES, slot: 'turret', moduleId: 31 });

    expect(selectedModules({ loadout: stockTurret, modules: MODULES }).gun).toBe(11);
  });
});

describe('moduleKeys', () => {
  it('sends no modules for the implicit top configuration', () => {
    expect(moduleKeys({ loadout: emptyLoadout(), modules: MODULES })).toBeUndefined();
  });

  it('names every chosen module by its key', () => {
    const loadout = setModule({ loadout: emptyLoadout(), modules: MODULES, slot: 'engine', moduleId: 21 });

    expect(moduleKeys({ loadout, modules: MODULES })).toEqual({ turret: 'key_32', gun: 'key_12', engine: 'key_21' });
  });
});

describe('sameLoadout', () => {
  it('treats an implicit top configuration as equal to the explicit one', () => {
    const explicit = setModule({ loadout: emptyLoadout(), modules: MODULES, slot: 'gun', moduleId: 12 });

    expect(sameLoadout({ a: emptyLoadout(), b: explicit, modules: MODULES })).toBe(true);
  });

  it('ignores the order skills were learned in', () => {
    const a = { ...emptyLoadout(), crewSkills: { commander: ['1', '2'], gunner: ['3'] } };
    const b = { ...emptyLoadout(), crewSkills: { gunner: ['3'], commander: ['2', '1'] } };

    expect(sameLoadout({ a, b, modules: MODULES })).toBe(true);
  });

  it('tells different equipment apart', () => {
    const b = setSlotItem({ loadout: emptyLoadout(), field: 'equipment', slot: 0, id: 101 });

    expect(sameLoadout({ a: emptyLoadout(), b, modules: MODULES })).toBe(false);
  });
});
