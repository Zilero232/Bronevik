import type { BuildUsage, ProvisionOption, ProvisionPick } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { recommendLoadout } from '../recommend-loadout';

const option = (id: number, tag = `item_${id}`): ProvisionOption => ({
  id,
  tag,
  name: tag,
  kind: 'optionalDevice',
  variant: null,
  group: null,
  image: null,
  price: null,
  categories: [],
  effects: []
});

const pick = (id: number, share: number, tag?: string): ProvisionPick => ({
  option: option(id, tag),
  battles: 10,
  share,
  winRate: null,
  avgDamage: null
});

const usage = (overrides: Partial<BuildUsage> = {}): BuildUsage => ({
  mode: 'random',
  cohort: 'top10',
  battles: 100,
  players: 20,
  minSample: 30,
  isEnough: true,
  windowDays: 30,
  gameVersion: null,
  computedAt: null,
  winRate: null,
  avgDamage: null,
  equipment: [
    { slot: 0, picks: [pick(1, 0.8), pick(2, 0.2)] },
    { slot: 1, picks: [pick(1, 0.6), pick(3, 0.4)] }
  ],
  consumables: [pick(10, 1), pick(11, 0.9), pick(12, 0.7), pick(13, 0.1)],
  directives: [pick(20, 0.5), pick(21, 0.3)],
  shells: [
    { shellId: 100, name: null, kind: 'ARMOR_PIERCING', isPremium: false, share: 1, ammoShare: 0.7, avgCount: 29.6 },
    { shellId: 101, name: null, kind: 'HIGH_EXPLOSIVE', isPremium: false, share: 0.1, ammoShare: 0.02, avgCount: 0.2 }
  ],
  fieldModifications: [
    { level: 2, kind: 'pair', picks: [pick(50, 0.2, 'mod_left'), pick(51, 0.7, 'mod_right')] },
    { level: 3, kind: 'pair', picks: [pick(52, 0.1, 'mod_rare')] }
  ],
  crew: [
    {
      role: 'commander',
      members: 1,
      skills: [
        { skill: 'commander_sixthSense', name: '', image: null, isCommon: false, share: 0.9, avgPosition: 0 },
        { skill: 'repair', name: '', image: null, isCommon: true, share: 0.8, avgPosition: 1 },
        { skill: 'commander_eagleEye', name: '', image: null, isCommon: false, share: 0.1, avgPosition: 2 }
      ]
    },
    {
      role: 'loader',
      members: 2,
      skills: [
        { skill: 'repair', name: '', image: null, isCommon: true, share: 0.5, avgPosition: 0.5 },
        { skill: 'loader_pedant', name: '', image: null, isCommon: false, share: 0.6, avgPosition: 1 }
      ]
    }
  ],
  ...overrides
});

describe('recommendLoadout', () => {
  it('is null without enough data', () => {
    expect(recommendLoadout(usage({ isEnough: false }))).toBeNull();
  });

  it('takes the most picked item per equipment slot without repeating one', () => {
    expect(recommendLoadout(usage())?.equipment).toEqual([1, 3, null]);
  });

  it('fills consumables and directive slots in pick order', () => {
    const loadout = recommendLoadout(usage());

    expect(loadout?.consumables).toEqual([10, 11, 12]);
    expect(loadout?.directives).toEqual([20, null, null]);
  });

  it('keeps the dominant field modification per level and drops rare ones', () => {
    expect(recommendLoadout(usage())?.fieldModifications).toEqual(['mod_right']);
  });

  it('puts common skills under the common role and role skills in learning order', () => {
    expect(recommendLoadout(usage())?.crewSkills).toEqual({
      common: ['repair'],
      commander: ['commander_sixthSense'],
      loader: ['loader_pedant']
    });
  });

  it('loads the shells players carry', () => {
    expect(recommendLoadout(usage())?.ammo).toEqual([{ shellId: 100, count: 30 }]);
  });
});
