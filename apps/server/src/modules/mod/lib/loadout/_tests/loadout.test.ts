import { describe, expect, it } from 'vitest';

import { readStoredLoadout } from '../loadout';

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
