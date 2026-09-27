import type { SettingInput } from '../../../../../entities/window-state';
import type { UiField } from '../../../../../shared/api/protocol';

export type FieldProps = {
  field: UiField;
  onSet: (input: SettingInput) => void;
};
