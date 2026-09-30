import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { CONTEXT_FILTER, SECTION, SECTION_NAV } from '../../../config';
import {
  $focusSeq,
  $hits,
  $invalid,
  $query,
  $state,
  $summaries,
  $view,
  openSection,
  receiveState,
  setContextFilter,
  setQuery,
  toggleExpanded
} from '../store';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');
const withRevision = (revision: number): string => JSON.stringify({ ...JSON.parse(sample), revision });

describe('store', () => {
  beforeEach(() => {
    $state.set(null);
    $invalid.set(false);
    $query.set('');
    $focusSeq.set(0);
    $view.set({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.all });
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

  it('summarises the pages and searches the cards of the latest state', () => {
    receiveState(sample);
    setQuery('minimap');

    expect($summaries.get()).toHaveLength(6);
    expect($hits.get().map(({ component }) => component.id)).toEqual(['minimap']);
  });

  it('opens the page a package asked for once per request', () => {
    const focused = (seq: number) => JSON.stringify({ ...JSON.parse(sample), revision: seq + 10, focus: { section: 'replays', seq } });

    receiveState(focused(1));

    expect($view.get().section).toBe(SECTION.replays);

    openSection(SECTION.hud);
    receiveState(focused(1));

    expect($view.get().section).toBe(SECTION.hud);

    receiveState(focused(2));

    expect($view.get().section).toBe(SECTION.replays);
  });

  it('opens a page with its filter cleared and the search closed, and remembers open cards', () => {
    setQuery('zoom');
    setContextFilter(CONTEXT_FILTER.hangar);
    toggleExpanded('minimap');
    toggleExpanded('damage_log');
    toggleExpanded('minimap');
    openSection(SECTION.profiles);

    expect($query.get()).toBe('');
    expect($view.get()).toEqual({ section: SECTION.profiles, expanded: ['damage_log'], context: CONTEXT_FILTER.all });
  });
});
