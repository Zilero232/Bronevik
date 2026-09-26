import { describe, expect, it } from 'vitest';

import { toStoredShot } from '../stored-shot';

const MOD_SHOT = { damage: 390, nominal: 390, shell: 'armor_piercing', outcome: 'damage', distance_m: 220, fatal: false } as const;

describe('toStoredShot', () => {
  it('renames the distance and keeps every other field', () => {
    const { distance_m: distance, ...rest } = MOD_SHOT;

    expect(toStoredShot(MOD_SHOT)).toEqual({ ...rest, distance });
  });
});
