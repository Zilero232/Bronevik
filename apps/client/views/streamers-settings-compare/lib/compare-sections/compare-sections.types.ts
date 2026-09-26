import type { SettingsDiffRow, SettingsGroupKey } from '@otmetki/schemas';

export type CompareSection = {
  group: SettingsGroupKey;
  rows: SettingsDiffRow[];
};
