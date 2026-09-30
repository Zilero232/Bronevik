import type { UiComponent, UiField, UiMessage, UiMessageOf, UiState } from '../../../../shared/api/protocol';

export type ApplyMessageInput = {
  state: UiState;
  message: UiMessage;
};

export type SetFieldInput = { field: UiField; message: Pick<UiMessageOf<'set'>, 'key' | 'value'> };

export type SetComponentInput = { component: UiComponent; message: UiMessageOf<'set'> };
