import { describe, expect, it } from 'vitest';

import { readStoredLoadout, toStoredLoadout } from '../loadout';

describe('toStoredLoadout', () => {
  it('maps the mod block to the stored camelCase shape', () => {
    expect(
      toStoredLoadout({
        optional_devices: [1, null, 3],
        consumables: [10],
        directives: [],
        shells: [{ shell_id: 99, count: 30 }],
        field_modifications: ['mod_a'],
        crew: [{ role: 'commander', skills: ['commander_sixthSense', 'repair'] }],
        gameplay_id: 0
      })
    ).toEqual({
      optionalDevices: [1, null, 3],
      consumables: [10],
      directives: [],
      shells: [{ shellId: 99, count: 30 }],
      fieldModifications: ['mod_a'],
      crew: [{ role: 'commander', skills: ['commander_sixthSense', 'repair'] }],
      gameplayId: 0
    });
  });
});

describe('readStoredLoadout', () => {
  it('fills the axes a legacy row does not have', () => {
    expect(readStoredLoadout({ optionalDevices: [1, 2], consumables: [3] })).toEqual({
      optionalDevices: [1, 2],
      consumables: [3],
      directives: [],
      shells: [],
      fieldModifications: [],
      crew: [],
      gameplayId: null
    });
  });

  it('refuses a value that is not a loadout', () => {
    expect(readStoredLoadout({ optionalDevices: 'x' })).toBeNull();
    expect(readStoredLoadout(null)).toBeNull();
  });
});
