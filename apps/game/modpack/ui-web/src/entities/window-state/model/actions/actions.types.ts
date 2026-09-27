import type { SettingValue } from '../../../../shared/api/protocol';

export type SettingInput = {
  key: string;
  value: SettingValue;
};

export type SetSettingInput = SettingInput & {
  component: string;
};
