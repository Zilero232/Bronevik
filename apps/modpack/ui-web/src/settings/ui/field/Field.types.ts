import type { SettingInput } from '../../model/actions/actions.types';
import type { UiField } from '../../model/protocol/protocol.types';

export type FieldProps<T extends UiField = UiField> = {
  field: T;
  onSet: (input: SettingInput) => void;
};
