import type { SettingValue } from '../protocol/protocol.types';

export type SettingInput = {
  key: string;
  value: SettingValue;
};

export type SetSettingInput = SettingInput & {
  component: string;
};
