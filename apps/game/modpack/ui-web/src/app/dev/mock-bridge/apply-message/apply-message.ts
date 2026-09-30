import type { UiComponent, UiField, UiState } from '../../../../shared/api/protocol';
import type { ApplyMessageInput, SetComponentInput, SetFieldInput } from './apply-message.types';

import { PROTOCOL } from '../../../../shared/api/protocol';
import { DEV_MOCK } from '../../config';

const setField = ({ field, message }: SetFieldInput): UiField => {
  const { value } = message;

  if (field.key !== message.key) {
    return field;
  }

  if (field.type === 'bool') {
    return typeof value === 'boolean' ? { ...field, value } : field;
  }

  if (field.type === 'int') {
    return typeof value === 'number' ? { ...field, value } : field;
  }

  return typeof value === 'string' ? { ...field, value } : field;
};

const setComponent = ({ component, message }: SetComponentInput): UiComponent => {
  if (component.id !== message.component) {
    return component;
  }

  const switched =
    component.switch?.key === message.key && typeof message.value === 'boolean' ? { ...component.switch, value: message.value } : component.switch;

  return { ...component, switch: switched, fields: component.fields.map((field) => setField({ field, message })) };
};

export const applyMessage = ({ state, message }: ApplyMessageInput): UiState => {
  const next = { ...state, revision: state.revision + 1, notice: null };

  if (message.type === 'set') {
    return { ...next, components: state.components.map((component) => setComponent({ component, message })) };
  }

  if (message.type === 'set_many') {
    const components = Object.entries(message.values).reduce(
      (current, [key, value]) =>
        current.map((component) => setComponent({ component, message: { type: 'set', component: message.component, key, value } })),
      state.components
    );

    return { ...next, components };
  }

  if (message.type === 'window_layout') {
    const { x, y, width, height, zoom, placed = true } = message;

    return { ...next, window: { x, y, width, height, zoom, placed } };
  }

  if (message.type === 'language' && message.language !== PROTOCOL.autoLanguage) {
    return { ...next, language: message.language, language_setting: message.language };
  }

  return { ...next, notice: { kind: 'info', text: `${DEV_MOCK.noticePrefix} ${message.type}`, code: null } };
};
