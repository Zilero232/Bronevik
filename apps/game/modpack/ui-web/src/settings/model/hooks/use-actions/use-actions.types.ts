import type { UiAction } from '../../protocol';

export type RunActionInput = {
  action: UiAction;
  row?: string;
  value?: string;
};
