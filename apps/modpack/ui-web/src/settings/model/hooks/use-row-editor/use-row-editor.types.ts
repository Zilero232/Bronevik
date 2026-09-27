import type { UiAction } from '../../protocol/protocol.types';

export type RowChoice = {
  row: string;
  action: UiAction;
};

export type RowDraft = RowChoice & {
  value: string;
};
