import { atom, computed } from 'nanostores';

import type { UiState } from '../../../../shared/api/protocol';
import type { ContextFilter, Section, UndoEntry, View } from './store.types';

import { parseState } from '../../../../shared/api/protocol';
import { CONTEXT_FILTER, SECTION_NAV } from '../../config';
import { searchComponents, summarize } from '../../lib/components';
import { fontSafeState } from '../../lib/font-safe-state';
import { seedScroll } from '../scroll';

export const $state = atom<UiState | null>(null);
export const $invalid = atom(false);
export const $view = atom<View>({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.all });
export const $query = atom('');
export const $undo = atom<UndoEntry[]>([]);
export const $focusSeq = atom(0);

export const $components = computed($state, (state) => state?.components ?? []);
export const $summaries = computed($components, summarize);
export const $hits = computed([$components, $query], (components, query) => searchComponents({ components, query }));

export const openSection = (section: Section): void => {
  $query.set('');
  $view.set({ ...$view.get(), section, context: CONTEXT_FILTER.all });
};

export const receiveState = (raw: string | null): boolean => {
  if (raw === null || raw === '') {
    return false;
  }

  const parsed = parseState(raw);

  $invalid.set(parsed === null);

  if (parsed === null) {
    return false;
  }

  const state = fontSafeState(parsed);

  const previous = $state.get();

  if (!previous) {
    seedScroll(state.scroll);
  }

  if (!previous || state.revision >= previous.revision) {
    $state.set(state);
  }

  if (state.focus && state.focus.seq !== $focusSeq.get()) {
    $focusSeq.set(state.focus.seq);
    openSection(state.focus.section);
  }

  return true;
};

export const setContextFilter = (context: ContextFilter): void => {
  $view.set({ ...$view.get(), context });
};

export const toggleExpanded = (componentId: string): void => {
  const view = $view.get();
  const open = view.expanded.includes(componentId);

  $view.set({ ...view, expanded: open ? view.expanded.filter((id) => id !== componentId) : [...view.expanded, componentId] });
};

export const setQuery = (query: string): void => {
  $query.set(query);
};
