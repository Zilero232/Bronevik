import { TANK_ROLES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { ClassifyVehicleInput } from '../vehicle-traits.types';

import { TANK_TRAITS } from '../../../config';
import { classifyVehicle, matchesTraits, readSpecTraits, researchXp, tankSources, toTankRole } from '../vehicle-traits';

const PREMIUM: ClassifyVehicleInput = {
  summary: { tier: 8, isPremium: true, isCollectible: false },
  spec: { tags: ['mediumTank'], role: 'role_MT_universal', notInShop: true },
  hasOffers: false
};

const REGULAR: ClassifyVehicleInput = {
  summary: { tier: 8, isPremium: false, isCollectible: false },
  spec: { tags: ['mediumTank'], role: null, notInShop: false },
  hasOffers: false
};

describe('readSpecTraits', () => {
  it('reads tags, role and the shop flag from a stored spec', () => {
    expect(readSpecTraits({ tags: ['a'], role: 'role_SPG', notInShop: true, other: 1 })).toEqual({ tags: ['a'], role: 'role_SPG', notInShop: true });
  });

  it('falls back to an empty trait set for a spec that is not an object', () => {
    expect(readSpecTraits(null)).toEqual({ tags: [], role: null, notInShop: false });
  });

  it('tolerates a malformed field without losing the others', () => {
    expect(readSpecTraits({ tags: 'x', role: 5, notInShop: true })).toEqual({ tags: [], role: null, notInShop: true });
  });
});

describe('toTankRole', () => {
  it('maps every known game role tag to its role', () => {
    for (const role of TANK_ROLES) {
      expect(toTankRole(`${TANK_TRAITS.rolePrefix}${role}`)).toBe(role);
    }
  });

  it('returns null for an unknown or unprefixed tag', () => {
    expect(toTankRole('role_unknown')).toBeNull();
    expect(toTankRole('MT_universal')).toBeNull();
    expect(toTankRole(null)).toBeNull();
  });
});

describe('classifyVehicle', () => {
  it('puts collector vehicles first whatever their price', () => {
    expect(classifyVehicle({ ...PREMIUM, summary: { ...PREMIUM.summary, isCollectible: true } })).toBe('collector');
  });

  it('treats a credit vehicle hidden from the shop as removed', () => {
    expect(classifyVehicle({ ...REGULAR, spec: { ...REGULAR.spec, notInShop: true } })).toBe('removed');
    expect(classifyVehicle(REGULAR)).toBe('researchable');
  });

  it('keeps a premium vehicle a shop premium when the game shop sells it or our offer history saw it', () => {
    expect(classifyVehicle({ ...PREMIUM, spec: { ...PREMIUM.spec, notInShop: false } })).toBe('premium');
    expect(classifyVehicle({ ...PREMIUM, hasOffers: true, spec: { ...PREMIUM.spec, tags: ['special'] } })).toBe('premium');
  });

  it('marks a hidden premium as a reward by its tags or its tier', () => {
    expect(classifyVehicle({ ...PREMIUM, spec: { ...PREMIUM.spec, tags: ['special'] } })).toBe('reward');
    expect(classifyVehicle({ ...PREMIUM, summary: { ...PREMIUM.summary, tier: TANK_TRAITS.rewardMinTier } })).toBe('reward');
    expect(classifyVehicle(PREMIUM)).toBe('premium');
  });
});

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
