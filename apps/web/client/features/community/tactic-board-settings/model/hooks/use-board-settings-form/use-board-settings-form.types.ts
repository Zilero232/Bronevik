import type { BoardSettingsPayload, BoardSettingsValues } from '../../../lib/board-settings';

export type UseBoardSettingsFormInput = {
  defaultValues: BoardSettingsValues;
  onSubmit: (payload: BoardSettingsPayload) => Promise<unknown>;
};
