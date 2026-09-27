import type { SettingValue } from '../protocol';

export type SettingInput = {
  key: string;
  value: SettingValue;
};

export type SetSettingInput = SettingInput & {
  component: string;
};
