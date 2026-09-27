import type { UiAction } from '../../protocol/protocol.types';

export type PendingAction = {
  action: UiAction;
  row?: string;
  value?: string;
};

export type RunActionInput = {
  action: UiAction;
  row?: string;
  value?: string;
};
