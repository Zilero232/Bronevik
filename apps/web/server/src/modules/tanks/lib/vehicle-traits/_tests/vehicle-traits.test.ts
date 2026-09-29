import { describe, expect, it } from 'vitest';

import type { TankSourcesInput } from '../vehicle-traits.types';

import { matchesTraits, researchXp, tankSources } from '../vehicle-traits';

const PREMIUM: Omit<TankSourcesInput, 'status'> = {
  spec: { tags: ['mediumTank'], role: 'role_MT_universal', notInShop: true },
  hasOffers: false
};

const REGULAR: Omit<TankSourcesInput, 'status'> = {
  spec: { tags: ['mediumTank'], role: null, notInShop: false },
  hasOffers: false
};

describe('tankSources', () => {
  it('names the tree for researchable vehicles and nothing for removed ones', () => {
    expect(tankSources({ ...REGULAR, status: 'researchable' })).toEqual(['techTree']);
    expect(tankSources({ ...REGULAR, status: 'removed' })).toEqual([]);
  });

  it('lists every channel a premium vehicle was seen in', () => {
    expect(tankSources({ ...PREMIUM, spec: { ...PREMIUM.spec, notInShop: false }, hasOffers: true, status: 'premium' })).toEqual([
      'inGameShop',
      'premiumShop'
    ]);
  });

  it('derives specific reward channels from the game tags', () => {
    expect(tankSources({ ...PREMIUM, spec: { ...PREMIUM.spec, tags: ['clanWarsBattles'] }, status: 'reward' })).toEqual(['clanWars']);
  });

  it('falls back to a generic reward when nothing more specific is known', () => {
    expect(tankSources({ ...PREMIUM, spec: { ...PREMIUM.spec, tags: ['special'] }, status: 'reward' })).toEqual(['reward']);
  });
});

describe('matchesTraits', () => {
  const traits = { status: 'premium', role: 'MT_universal' } as const;

  it('passes everything through an empty filter', () => {
    expect(matchesTraits({ traits, filter: {} })).toBe(true);
  });

  it('requires both the status and the role to match', () => {
    expect(matchesTraits({ traits, filter: { statuses: ['premium'], roles: ['MT_universal'] } })).toBe(true);
    expect(matchesTraits({ traits, filter: { statuses: ['reward'] } })).toBe(false);
    expect(matchesTraits({ traits: { ...traits, role: null }, filter: { roles: ['MT_universal'] } })).toBe(false);
  });
});

describe('researchXp', () => {
  it('reads the unlock cost from the game-data list shape', () => {
    expect(
      researchXp({
        nextTanks: [
          { tankId: 5, xp: 41_000 },
          { tankId: 6, xp: 1 }
        ],
        tankId: 5
      })
    ).toBe(41_000);
  });

  it('reads the unlock cost from the Lesta encyclopedia map shape', () => {
    expect(researchXp({ nextTanks: { '5': 41_000 }, tankId: 5 })).toBe(41_000);
  });

  it('is unknown for a tank the parent does not unlock or a malformed value', () => {
    expect(researchXp({ nextTanks: [{ tankId: 6, xp: 1 }], tankId: 5 })).toBeNull();
    expect(researchXp({ nextTanks: 'x', tankId: 5 })).toBeNull();
  });
});
