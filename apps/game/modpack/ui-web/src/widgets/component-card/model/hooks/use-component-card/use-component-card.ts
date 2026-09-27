import { useState } from 'preact/hooks';

import type { SettingInput } from '../../../../../entities/window-state';
import type { UiComponent } from '../../../../../shared/api/protocol';
import type { StringKey } from '../../../../../shared/i18n';
import type { RunActionInput } from './use-component-card.types';

import { setSetting, toggleSwitch } from '../../../../../entities/window-state';
import { send } from '../../../../../shared/api/protocol';

export const useComponentCard = (component: UiComponent) => {
  const [pending, setPending] = useState<RunActionInput | null>(null);

  const perform = ({ action, row, value }: RunActionInput): void => {
    setPending(null);

    if (action.link) {
      send({ type: 'open', path: action.link });

      return;
    }

    send({ type: 'action', component: component.id, action: action.id, row, value });
  };

  const run = (input: RunActionInput): void => {
    if (input.action.confirm) {
      setPending(input);

      return;
    }

    perform(input);
  };

  const switchLabelKey: StringKey = component.switch?.value ? 'on' : 'off';

  return {
    switchLabelKey,
    showEmpty: component.fields.length === 0 && !component.page,
    actionItems: component.actions.map((action) => ({ id: action.id, label: action.label, onClick: () => run({ action }) })),
    confirmText: pending?.action.confirm ?? null,
    run,
    confirm: () => {
      if (pending) {
        perform(pending);
      }
    },
    cancel: () => setPending(null),
    toggle: () => toggleSwitch(component),
    setField: (input: SettingInput) => setSetting({ component: component.id, ...input })
  };
};
