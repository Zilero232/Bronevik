import { describe, expect, it } from 'vitest';

import type { QuickPreset } from '@/shared/lib';

import { activePresets, presetsPatch } from '@/shared/lib';

type State = { tiers: number[]; premium: 'all' | 'premium'; pinned: boolean };

const PRESETS: QuickPreset<State, 'pinned' | 'premium' | 'tier10' | 'tier8'>[] = [
  { id: 'tier10', patch: { tiers: [10] } },
  { id: 'tier8', patch: { tiers: [8] } },
  { id: 'premium', patch: { premium: 'premium' } },
  { id: 'pinned', patch: { pinned: true } }
];

const IDLE: State = { tiers: [], premium: 'all', pinned: false };

describe('activePresets', () => {
  it('marks nothing active on an untouched state', () => {
    expect(activePresets({ presets: PRESETS, state: IDLE })).toEqual([]);
  });

  it('compares array values by content', () => {
    expect(activePresets({ presets: PRESETS, state: { ...IDLE, tiers: [10], pinned: true } })).toEqual(['tier10', 'pinned']);
  });

  it('does not light a preset that only partly matches', () => {
    expect(activePresets({ presets: PRESETS, state: { ...IDLE, tiers: [8, 10] } })).toEqual([]);
  });
});

describe('presetsPatch', () => {
  it('applies the preset that was switched on', () => {
    expect(presetsPatch({ presets: PRESETS, active: [], next: ['premium'] })).toEqual({ premium: 'premium' });
  });

  it('clears the keys of the preset that was switched off', () => {
    expect(presetsPatch({ presets: PRESETS, active: ['tier10', 'pinned'], next: ['tier10'] })).toEqual({ pinned: null });
  });

  it('lets a new preset win over one it replaces on the same key', () => {
    expect(presetsPatch({ presets: PRESETS, active: ['tier10'], next: ['tier10', 'tier8'] })).toEqual({ tiers: [8] });
  });
});
