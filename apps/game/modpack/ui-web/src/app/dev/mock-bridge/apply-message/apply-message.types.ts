import type { UiMessage, UiState } from '../../../../shared/api/protocol';

export type ApplyMessageInput = {
  state: UiState;
  message: UiMessage;
};
