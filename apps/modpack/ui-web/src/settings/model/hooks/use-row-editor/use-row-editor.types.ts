import type { UiAction } from '../../protocol';

export type RowChoice = {
  row: string;
  action: UiAction;
};

export type RowDraft = RowChoice & {
  value: string;
};
