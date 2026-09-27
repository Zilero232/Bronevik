import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $groups, $invalid, $selected, $state, $view, openComponent, openSection, receiveState } from '../store';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../protocol/_tests/fixtures/state.sample.json'), 'utf8');
const withRevision = (revision: number): string => JSON.stringify({ ...JSON.parse(sample), revision });

describe('store', () => {
  beforeEach(() => {
    $state.set(null);
    $invalid.set(false);
    $view.set({ section: 'components', componentId: null });
  });

  it('keeps the newest revision and flags invalid pushes', () => {
    expect(receiveState(withRevision(5))).toBe(true);
    expect(receiveState(withRevision(3))).toBe(true);
    expect($state.get()?.revision).toBe(5);
    expect(receiveState('{')).toBe(false);
    expect($invalid.get()).toBe(true);
    expect($state.get()?.revision).toBe(5);
    expect(receiveState(null)).toBe(false);
  });

  it('groups cards data, hangar, battle', () => {
    receiveState(sample);

    expect($groups.get().map(({ id }) => id)).toEqual(['data', 'hangar', 'battle']);
    expect($groups.get()[2]?.components.map(({ id }) => id)).toEqual(['marks_panel', 'minimap', 'damage_log']);
  });

  it('selects the first card until one is opened, and a missing one falls back', () => {
    receiveState(sample);

    expect($selected.get()?.id).toBe('companion');
    openComponent('minimap');
    expect($selected.get()?.id).toBe('minimap');
    openSection('profiles');
    expect($view.get()).toEqual({ section: 'profiles', componentId: 'minimap' });
    openComponent('gone');
    expect($selected.get()?.id).toBe('companion');
  });
});
