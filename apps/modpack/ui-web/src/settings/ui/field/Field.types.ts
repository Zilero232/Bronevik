import type { SettingInput } from '../../model/actions';
import type { UiField } from '../../model/protocol';

export type FieldProps<T extends UiField = UiField> = {
  field: T;
  onSet: (input: SettingInput) => void;
};
