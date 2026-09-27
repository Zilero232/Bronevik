import { describe, expect, it } from 'vitest';

import { readStoredShots } from '../stored-shots';

const SHOT = { damage: 390, nominal: 390, shell: 'armor_piercing', outcome: 'damage', distance: 220, fatal: false } as const;

describe('readStoredShots', () => {
  it('returns an empty list for a non-array value', () => {
    expect(readStoredShots(null)).toEqual([]);
    expect(readStoredShots({ damage: 1 })).toEqual([]);
  });

  it('drops malformed entries and keeps the valid ones', () => {
    expect(readStoredShots([SHOT, { damage: -1 }, 'shot'])).toEqual([SHOT]);
  });
});
