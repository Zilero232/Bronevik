import { describe, expect, it } from 'vitest';

import { toStoredLoadout } from '../stored-loadout';

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
