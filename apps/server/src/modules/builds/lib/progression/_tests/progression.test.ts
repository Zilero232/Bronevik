import type { FieldModification } from '@otmetki/gamedata';
import type { ProvisionOption } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { fieldModificationSteps } from '../progression';

const modification = (name: string, id: number): FieldModification => ({ name, id, provisionId: 1_000 + id, modifiers: [] });

const option = (name: string, id: number): ProvisionOption => ({
  id,
  tag: name,
  name,
  kind: 'fieldModification',
  variant: null,
  group: null,
  image: null,
  price: null,
  categories: [],
  effects: []
});

const modifications = [modification('armor', 1), modification('reload', 2), modification('aim', 3), modification('ghost', 4)];

const known = new Map([
  ['armor', option('armor', 1)],
  ['reload', option('reload', 2)],
  ['aim', option('aim', 3)]
]);

const optionOf = (name: string) => known.get(name);

const step = (id: number, level: number, action: { type: string; value: string }, extra: Record<string, number> = {}) => ({
  id,
  level,
  action,
  ...extra
});

const tree = {
  name: 'heavy_tree',
  id: 1,
  steps: [
    step(1, 1, { type: 'modification', value: 'armor' }),
    step(2, 2, { type: 'pair_modification', value: 'reload_or_aim' }),
    step(3, 3, { type: 'modification', value: 'ghost' }),
    step(4, 4, { type: 'pair_modification', value: 'ghost_or_aim' }),
    step(5, 5, { type: 'modification', value: 'armor' }, { minVehicleLevel: 11 }),
    step(6, 6, { type: 'feature', value: 'something' })
  ]
};

const pairs = [
  { name: 'reload_or_aim', id: 1, first: 'reload', second: 'aim' },
  { name: 'ghost_or_aim', id: 2, first: 'ghost', second: 'aim' },
  { broken: true }
];

describe('fieldModificationSteps', () => {
  it('turns single and paired steps into option lists by level', () => {
    const steps = fieldModificationSteps({ tree, pairs, modifications, tier: 10, optionOf });

    expect(steps.slice(0, 2)).toEqual([
      { level: 1, kind: 'modification', options: [known.get('armor')] },
      { level: 2, kind: 'pair', options: [known.get('reload'), known.get('aim')] }
    ]);
  });

  it('drops a single step whose option is unknown', () => {
    const steps = fieldModificationSteps({ tree, pairs, modifications, tier: 10, optionOf });

    expect(steps.some((entry) => entry.level === 3)).toBe(false);
  });

  it('keeps the known half of a pair', () => {
    const steps = fieldModificationSteps({ tree, pairs, modifications, tier: 10, optionOf });

    expect(steps.find((entry) => entry.level === 4)).toEqual({ level: 4, kind: 'pair', options: [known.get('aim')] });
  });

  it('drops a pair with no known option at all', () => {
    const steps = fieldModificationSteps({
      tree,
      pairs,
      modifications,
      tier: 10,
      optionOf: (name) => (name === 'armor' ? known.get(name) : undefined)
    });

    expect(steps.map((entry) => entry.level)).toEqual([1]);
  });

  it('skips steps outside the vehicle tier and non-modification steps', () => {
    const steps = fieldModificationSteps({ tree, pairs, modifications, tier: 10, optionOf });

    expect(steps.map((entry) => entry.level)).toEqual([1, 2, 4]);
  });

  it('includes a tier-limited step once the vehicle reaches the tier', () => {
    const steps = fieldModificationSteps({ tree, pairs, modifications, tier: 11, optionOf });

    expect(steps.map((entry) => entry.level)).toContain(5);
  });

  it('returns nothing for an unreadable tree', () => {
    expect(fieldModificationSteps({ tree: { name: 'x' }, pairs, modifications, tier: 10, optionOf })).toEqual([]);
    expect(fieldModificationSteps({ tree: null, pairs, modifications, tier: 10, optionOf })).toEqual([]);
  });

  it('ignores unreadable pairs, leaving their steps empty', () => {
    const steps = fieldModificationSteps({ tree, pairs: [{ broken: true }], modifications, tier: 10, optionOf });

    expect(steps.map((entry) => entry.level)).toEqual([1]);
  });
});
