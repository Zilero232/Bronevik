import type { UiComponent, UiField, UiMessage } from '../../../settings/model/protocol';
import type { ApplyMessageInput } from './apply-message.types';

type SetMessage = Extract<UiMessage, { type: 'set' }>;

const setField = (field: UiField, message: SetMessage): UiField => {
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

const setComponent = (component: UiComponent, message: SetMessage): UiComponent => {
  if (component.id !== message.component) {
    return component;
  }

  const switched =
    component.switch?.key === message.key && typeof message.value === 'boolean' ? { ...component.switch, value: message.value } : component.switch;

  return { ...component, switch: switched, fields: component.fields.map((field) => setField(field, message)) };
};

export const applyMessage = ({ state, message }: ApplyMessageInput): ApplyMessageInput['state'] => {
  const next = { ...state, revision: state.revision + 1, notice: null };

  if (message.type === 'set') {
    return { ...next, components: state.components.map((component) => setComponent(component, message)) };
  }

  if (message.type === 'language' && message.language !== 'auto') {
    return { ...next, language: message.language, language_setting: message.language };
  }

  return { ...next, notice: { kind: 'info', text: `mock bridge: ${message.type}`, code: null } };
};
