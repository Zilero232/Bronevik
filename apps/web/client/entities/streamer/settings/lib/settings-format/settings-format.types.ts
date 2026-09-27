import type { FlatValue, SettingsGroupKey, StreamerSettings } from '@otmetki/schemas';

import type { SETTINGS_FIELDS } from '../../config';

export type SettingsField = (typeof SETTINGS_FIELDS)[number];

export type SettingsFieldPath = SettingsField['path'];

export type SettingsRow = {
  path: string;
  value: FlatValue;
};

export type SettingsTextInput = {
  displayName: string;
  settings: StreamerSettings;
  label: (key: string) => string;
  value: (row: SettingsRow) => string;
};

export type SettingsRowsInput = {
  settings: StreamerSettings;
  group: SettingsGroupKey;
};
