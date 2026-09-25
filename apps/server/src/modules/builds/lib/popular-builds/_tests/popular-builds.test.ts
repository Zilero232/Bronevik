import { describe, expect, it } from 'vitest';

import type { LoadoutSample } from '../popular-builds.types';

import { rankLoadouts } from '../popular-builds';

const sample = (overrides: Partial<LoadoutSample>): LoadoutSample => ({
  optionalDevices: [1, 2],
  consumables: [10],
  directives: [],
  weight: 1,
  won: true,
  damage: 2_000,
  ...overrides
});

describe('rankLoadouts', () => {
  it('groups the same loadout regardless of order and duplicates', () => {
    const ranked = rankLoadouts({ samples: [sample({}), sample({ optionalDevices: [2, 1, 1] })], limit: 10 });

    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.optionalDevices).toEqual([1, 2]);
    expect(ranked[0]?.battles).toBe(2);
  });

  it('skips a sample with nothing equipped', () => {
    expect(rankLoadouts({ samples: [sample({ optionalDevices: [], consumables: [], directives: [] })], limit: 10 })).toEqual([]);
  });

  it('orders loadouts by weight and cuts at the limit', () => {
    const ranked = rankLoadouts({
      samples: [sample({ weight: 1 }), sample({ consumables: [11], weight: 5 }), sample({ consumables: [12], weight: 3 })],
      limit: 2
    });

    expect(ranked.map((loadout) => loadout.consumables)).toEqual([[11], [12]]);
  });

  it('computes each share against the total weight', () => {
    const ranked = rankLoadouts({ samples: [sample({ weight: 3 }), sample({ consumables: [11], weight: 1 })], limit: 10 });

    expect(ranked.map((loadout) => loadout.share)).toEqual([3 / 4, 1 / 4]);
  });

  it('computes the win rate only over decided battles', () => {
    const [loadout] = rankLoadouts({ samples: [sample({ won: true }), sample({ won: false }), sample({ won: null })], limit: 10 });

    expect(loadout?.winRate).toBe((1 * 100) / 2);
  });

  it('reports no win rate or damage when nothing is known', () => {
    const [loadout] = rankLoadouts({ samples: [sample({ won: null, damage: null })], limit: 10 });

    expect(loadout?.winRate).toBeNull();
    expect(loadout?.avgDamage).toBeNull();
  });

  it('averages damage over the samples that report it, counting a zero', () => {
    const [loadout] = rankLoadouts({ samples: [sample({ damage: 0 }), sample({ damage: 3_000 }), sample({ damage: null })], limit: 10 });

    expect(loadout?.avgDamage).toBe((0 + 3_000) / 2);
  });
});
