import type { BoardSettingsPayload, BoardSettingsValues } from '../lib/board-settings';

export type BoardSettingsFormProps = {
  defaultValues: BoardSettingsValues;
  submitLabel: string;
  onSubmit: (payload: BoardSettingsPayload) => Promise<unknown>;
};
