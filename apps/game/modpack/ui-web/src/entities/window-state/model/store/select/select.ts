import type { UiComponent, UiState } from '../../../../../shared/api/protocol';
import type { ComponentGroup, View } from '../store.types';

import { PROTOCOL } from '../../../../../shared/api/protocol';

const groupOrder = (group: string): number => {
  const index = PROTOCOL.groups.findIndex((known) => known === group);

  return index === -1 ? PROTOCOL.groups.length : index;
};

export const groupComponents = (components: UiComponent[]): ComponentGroup[] => {
  const groups = new Map<string, UiComponent[]>();

  for (const component of components) {
    groups.set(component.group, [...(groups.get(component.group) ?? []), component]);
  }

  return [...groups.entries()].sort(([left], [right]) => groupOrder(left) - groupOrder(right)).map(([id, members]) => ({ id, components: members }));
};

export const selectedComponent = (state: UiState | null, view: View): UiComponent | null => {
  if (!state) {
    return null;
  }

  return state.components.find(({ id }) => id === view.componentId) ?? state.components[0] ?? null;
};
