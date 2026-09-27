import type { SettingInput } from '../../../../../entities/window-state';
import type { FieldOf } from '../../../../../shared/api/protocol';

export type IntFieldProps = {
  field: FieldOf<'int'>;
  onSet: (input: SettingInput) => void;
};
