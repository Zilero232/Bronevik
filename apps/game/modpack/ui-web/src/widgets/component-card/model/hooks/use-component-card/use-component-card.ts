import { useStore } from '@nanostores/preact';
import { useState } from 'preact/hooks';

import type { SettingInput } from '../../../../../entities/window-state';
import type { StringKey } from '../../../../../shared/i18n';
import type { RunActionInput, UseComponentCardInput } from './use-component-card.types';

import {
  $state,
  $view,
  changedFields,
  changeSetting,
  componentIcon,
  isEnabled,
  resetComponent,
  toggleExpanded,
  toggleSwitch
} from '../../../../../entities/window-state';
import { send } from '../../../../../shared/api/protocol';
import { CONTEXT_BADGES } from '../../../config';

export const useComponentCard = ({ component, fields, forceOpen = false }: UseComponentCardInput) => {
  const view = useStore($view);
  const state = useStore($state);
  const [pending, setPending] = useState<RunActionInput | null>(null);
  const shown = fields ?? component.fields;
  const changed = changedFields(component);
  const listPage = component.page?.kind === 'list';
  const expandable = shown.length > 0 || component.actions.length > 0 || listPage || component.panel;
  const open = expandable && (forceOpen || view.expanded.includes(component.id));

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
    icon: componentIcon(component.id),
    enabled: isEnabled(component),
    badges: CONTEXT_BADGES[component.context],
    changedCount: changed.length,
    fields: shown,
    expandable,
    open,
    switchLabelKey,
    preview: component.panel ? (state?.hud.panels.find(({ id }) => id === component.id)?.preview ?? null) : null,
    showEmpty: shown.length === 0 && !listPage && component.actions.length === 0,
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
    toggleOpen: () => {
      if (expandable && !forceOpen) {
        toggleExpanded(component.id);
      }
    },
    reset: () => resetComponent(component),
    moveOnScreen: () => send({ type: 'hud_edit', active: true }),
    setField: ({ key, value }: SettingInput) => changeSetting({ component, key, value })
  };
};
