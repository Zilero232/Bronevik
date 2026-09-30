import { useStore } from '@nanostores/preact';

import { $components, toggleSwitch } from '../../../../../entities/window-state';

export const useReplaysPage = () => {
  const component = useStore($components).find(({ page }) => page?.kind === 'replays') ?? null;

  return component ? { page: component.page, enabled: component.switch?.value ?? true, turnOn: () => toggleSwitch(component) } : null;
};
