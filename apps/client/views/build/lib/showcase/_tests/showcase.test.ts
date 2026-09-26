import type { BuildUsage, ProvisionOption, ProvisionPick } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { crewColumns, equipmentMatrix, fieldModRing, shellMix } from '..';

const device = (id: number, group: string, variant: string | null = 'standard'): ProvisionOption => ({
  id,
  tag: `${group}-${variant}`,
  name: `${group} ${variant}`,
  kind: 'optionalDevice',
  variant,
  group,
  image: null,
  price: null,
  categories: [],
  effects: []
});

const pick = (option: ProvisionOption, share: number): ProvisionPick => ({ option, share, battles: 100, winRate: null, avgDamage: null });

const RAMMER = device(1, 'rammer');
const VENTS = device(2, 'vents');
const OPTICS = device(3, 'optics');
const TURBO = device(4, 'turbo');
const RAMMER_TROPHY = device(11, 'rammer', 'trophy');
const VENTS_TROPHY = device(12, 'vents', 'trophy');
const DIRECTIVE = { ...device(21, 'directive', null), kind: 'directive' as const };

const usage = (patch: Partial<BuildUsage> = {}): BuildUsage => ({
  mode: 'random',
  cohort: 'top10',
  battles: 1000,
  players: 100,
  minSample: 30,
  isEnough: true,
  windowDays: 30,
  gameVersion: '1.45',
  computedAt: null,
  winRate: null,
  avgDamage: null,
  equipment: [
    { slot: 0, picks: [pick(RAMMER, 0.7), pick(RAMMER_TROPHY, 0.2)] },
    { slot: 1, picks: [pick(VENTS, 0.6), pick(TURBO, 0.1)] },
    { slot: 2, picks: [pick(OPTICS, 0.5)] }
  ],
  consumables: [],
  directives: [pick(DIRECTIVE, 0.4)],
  shells: [],
  fieldModifications: [],
  crew: [],
  ...patch
});

const DEVICES = [RAMMER, VENTS, OPTICS, TURBO, RAMMER_TROPHY, VENTS_TROPHY];

describe('equipmentMatrix', () => {
  it('ranks device families across slots and swaps the weakest for the alternative', () => {
    const [standard] = equipmentMatrix({ usage: usage(), devices: DEVICES, slots: 3 });

    expect(standard?.primary.map((tile) => tile?.id)).toEqual([RAMMER.id, VENTS.id, OPTICS.id]);
    expect(standard?.alternative?.map((tile) => tile?.id)).toEqual([RAMMER.id, VENTS.id, TURBO.id]);
  });

  it('maps each family to the variant of its column and drops columns with no variants', () => {
    const columns = equipmentMatrix({ usage: usage(), devices: DEVICES, slots: 3 });
    const trophy = columns.find(({ category }) => category === 'trophy');

    expect(columns.map(({ category }) => category)).toEqual(['standard', 'trophy']);
    expect(trophy?.primary.map((tile) => tile?.id ?? null)).toEqual([RAMMER_TROPHY.id, VENTS_TROPHY.id, null]);
  });

  it('adds up the share of an option over every slot it was put in', () => {
    const [standard] = equipmentMatrix({ usage: usage(), devices: DEVICES, slots: 3 });

    expect(standard?.primary[0]?.share).toBeCloseTo(0.7);
    expect(standard?.directive?.id).toBe(DIRECTIVE.id);
    expect(standard?.directiveAlternative).toBeNull();
  });

  it('returns nothing without equipment usage', () => {
    expect(equipmentMatrix({ usage: usage({ equipment: [] }), devices: DEVICES, slots: 3 })).toEqual([]);
  });
});

describe('fieldModRing', () => {
  const steps = [
    {
      key: 'l1',
      level: 1,
      options: [{ id: 5, tag: 'a', name: 'A', kind: 'fieldModification' as const, image: null, category: null, isPremium: false }]
    },
    {
      key: 'l2',
      level: 2,
      options: [
        { id: 6, tag: 'b', name: 'B', kind: 'fieldModification' as const, image: null, category: null, isPremium: false },
        { id: 7, tag: 'c', name: 'C', kind: 'fieldModification' as const, image: null, category: null, isPremium: false }
      ]
    }
  ];

  it('keeps only real choices and picks the most chosen option', () => {
    const fieldModifications = [{ level: 2, kind: 'pair' as const, picks: [pick(device(6, 'b'), 0.3), pick(device(7, 'c'), 0.7)] }];
    const [pair] = fieldModRing({ steps, usage: usage({ fieldModifications }) });

    expect(fieldModRing({ steps, usage: null })).toHaveLength(1);

    expect(pair?.options.map(({ isPicked, share }) => [isPicked, share])).toEqual([
      [false, 0.3],
      [true, 0.7]
    ]);
  });
});

describe('crewColumns', () => {
  it('takes the most learned skills and orders them by learning order', () => {
    const skill = (name: string, share: number, avgPosition: number) => ({ skill: name, name, image: null, isCommon: false, share, avgPosition });
    const [column] = crewColumns({
      usage: usage({ crew: [{ role: 'commander', members: 10, skills: [skill('a', 0.9, 2), skill('b', 0.8, 0), skill('c', 0.1, 1)] }] }),
      limit: 2
    });

    expect(column?.skills.map(({ skill: id }) => id)).toEqual(['b', 'a']);
  });
});

describe('shellMix', () => {
  it('sorts carried shells by ammo share and drops empty ones', () => {
    const shell = (shellId: number, ammoShare: number) => ({ shellId, name: null, kind: 'AP', isPremium: false, share: 1, ammoShare, avgCount: 10 });

    expect(shellMix({ shells: [shell(1, 0.2), shell(2, 0.8), shell(3, 0)] }).map(({ shellId }) => shellId)).toEqual([2, 1]);
  });
});
