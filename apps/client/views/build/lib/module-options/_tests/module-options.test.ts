import { toRoman } from '@otmetki/icons';
import { describe, expect, it } from 'vitest';

import type { BuildModule } from '../../build-catalog';

import { moduleOptions } from '../module-options';

const LABELS = { stock: 'stock', top: 'top' };

const module = (id: number, tier: number): BuildModule => ({ id, key: `m${id}`, slot: 'gun', name: `Gun ${id}`, tier, turretId: null });

describe('moduleOptions', () => {
  it('labels the first module stock, the last top and the rest by tier', () => {
    const labels = moduleOptions({ modules: [module(1, 6), module(2, 7), module(3, 8)], labels: LABELS }).map(({ label }) => label);

    expect(labels).toEqual([LABELS.stock, toRoman(7), LABELS.top]);
  });

  it('calls a single module the top one', () => {
    expect(moduleOptions({ modules: [module(1, 6)], labels: LABELS })).toEqual([{ value: '1', label: LABELS.top }]);
  });
});
