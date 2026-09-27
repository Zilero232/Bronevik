import catalog from '@contract/catalog.json';
import { describe, expect, it } from 'vitest';

import { catalogSchema } from '@/entities/catalog';

import { closeDependencies, matchingPreset, presetSelection, toggleSelection } from '../selection';

const { components, presets } = catalogSchema.parse(catalog);
const required = components.filter((component) => component.required).map((component) => component.id);

describe('closeDependencies', () => {
  it('adds what a component needs and every required component', () => {
    const selection = closeDependencies({ components, ids: ['hit_log'] });

    expect([...selection].toSorted()).toEqual([...required, 'damage_log', 'hit_log'].toSorted());
  });

  it('drops ids the catalog does not know', () => {
    expect(closeDependencies({ components, ids: ['battle'] }).has('battle')).toBe(false);
  });
});

describe('toggleSelection', () => {
  const full = presetSelection({ components, presetId: presets[0]?.id ?? null });

  it('unticks what depends on the unticked component', () => {
    const selection = toggleSelection({ components, selection: full, id: 'damage_log', checked: false });

    expect(selection.has('damage_log')).toBe(false);
    expect(selection.has('hit_log')).toBe(false);
  });

  it('never unticks a required component', () => {
    const [core = ''] = required;

    expect(toggleSelection({ components, selection: full, id: core, checked: false })).toBe(full);
  });
});

describe('matchingPreset', () => {
  it('names the preset a selection equals and falls back to the custom one', () => {
    const [first] = presets;
    const custom = presets.find((preset) => preset.custom);
    const selection = presetSelection({ components, presetId: first?.id ?? null });

    expect(matchingPreset({ components, presets, selection })).toBe(first?.id);

    expect(matchingPreset({ components, presets, selection: toggleSelection({ components, selection, id: 'hit_log', checked: false }) })).toBe(
      custom?.id
    );
  });
});
