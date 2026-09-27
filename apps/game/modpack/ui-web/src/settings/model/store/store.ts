import { atom, computed } from 'nanostores';

import type { UiState } from '../protocol';
import type { Section, View } from './store.types';

import { parseState } from '../protocol';
import { groupComponents, selectedComponent } from './select';

export const $state = atom<UiState | null>(null);
export const $invalid = atom(false);
export const $view = atom<View>({ section: 'components', componentId: null });

export const $groups = computed($state, (state) => groupComponents(state?.components ?? []));
export const $selected = computed([$state, $view], selectedComponent);

export const receiveState = (raw: string | null): boolean => {
  if (raw === null || raw === '') {
    return false;
  }

  const state = parseState(raw);

  $invalid.set(state === null);

  if (state === null) {
    return false;
  }

  const previous = $state.get();

  if (!previous || state.revision >= previous.revision) {
    $state.set(state);
  }

  return true;
};

export const openSection = (section: Section): void => {
  $view.set({ ...$view.get(), section });
};

export const openComponent = (componentId: string): void => {
  $view.set({ section: 'components', componentId });
};
