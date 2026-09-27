import type { UiMessage, UiState } from '../../../settings/model/protocol';

export type ApplyMessageInput = {
  state: UiState;
  message: UiMessage;
};
