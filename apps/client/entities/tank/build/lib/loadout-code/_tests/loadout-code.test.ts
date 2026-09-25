import type { Loadout } from '@bronevik/schemas';

import { LOADOUT } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { emptyLoadout, parseLoadout, serializeLoadout } from '../loadout-code';

const FULL: Loadout = {
  profileId: '11,12,14',
  equipment: [101, null, 104],
  consumables: [201, 202, 204],
  directives: [301, null, null],
  ammo: [],
  crewSkills: { commander: ['402', '401'], gunner: ['404'] },
  fieldModifications: ['501', '503']
};

describe('serializeLoadout / parseLoadout', () => {
  it('restores a loadout exactly after a round trip through the URL code', () => {
    expect(parseLoadout(serializeLoadout(FULL))).toEqual(FULL);
  });

  it('keeps empty slots in place so a device stays in its specialisation slot', () => {
    expect(parseLoadout(serializeLoadout(FULL))?.equipment.indexOf(104)).toBe(FULL.equipment.indexOf(104));
  });

  it('round-trips an empty loadout without inventing modules or skills', () => {
    const parsed = parseLoadout(serializeLoadout(emptyLoadout()));

    expect(parsed?.profileId).toBeUndefined();
    expect(parsed?.crewSkills).toEqual({});
    expect(parsed?.equipment).toHaveLength(LOADOUT.equipmentSlots);
  });

  it('drops garbage ids instead of failing the whole build', () => {
    expect(parseLoadout('e:abc,-5,101')?.equipment).toEqual([null, null, 101]);
  });
});
