import type { TankPatch } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { specPath, TANK_SPEC_KEYS } from '@/entities/tank/tank';

import { patchChangeRow, patchEntries } from '../patch-verdict';

const [SPEC] = TANK_SPEC_KEYS;

const PATCHES: TankPatch[] = [
  { version: '1.0', title: null, date: '2026-01-10T00:00:00Z', verdict: 'new', changes: [] },
  {
    version: '1.2',
    title: null,
    date: '2026-06-10T00:00:00Z',
    verdict: 'nerf',
    changes: [{ key: `top.${specPath(SPEC)}`, before: 10, after: 12, effect: 'worse' }]
  }
];

describe('patchEntries', () => {
  it('puts the newest patch first', () => {
    expect(patchEntries(PATCHES).map(({ version }) => version)).toEqual(['1.2', '1.0']);
  });

  it('keeps the verdict the API computed', () => {
    expect(patchEntries(PATCHES).map(({ verdict }) => verdict)).toEqual(PATCHES.map(({ verdict }) => verdict).reverse());
  });
});

describe('patchChangeRow', () => {
  it('takes the direction of a change from its effect', () => {
    expect(patchChangeRow({ key: 'top.x', before: 1, after: 2, effect: 'worse' }).verdict).toBe('worse');
    expect(patchChangeRow({ key: 'top.x', before: 1, after: 2, effect: 'neutral' }).verdict).toBe('same');
  });

  it('recognises a known spec behind a profile-prefixed path', () => {
    expect(patchChangeRow({ key: `stock.${specPath(SPEC)}`, before: 1, after: 2, effect: 'better' }).specKey).toBe(SPEC);
  });

  it('leaves the delta empty when a side is unknown or not a number', () => {
    expect(patchChangeRow({ key: 'top.x', before: null, after: 3, effect: 'neutral' }).delta).toBeNull();
    expect(patchChangeRow({ key: 'top.x', before: 'a', after: 'b', effect: 'neutral' }).delta).toBeNull();
  });
});
