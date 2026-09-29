import type { SettingsOption } from '../lib/settings-value';

import { SETTINGS_FIELDS } from './settings-fields.constants';

export const SETTINGS_VALUE = {
  booleans: ['true', 'false'],
  sensitivityPrefix: 'controls.sensitivity.',
  checkedDate: { day: '2-digit', month: '2-digit', year: 'numeric' }
} as const;

export const SETTINGS_OPTIONS: readonly SettingsOption[] = [
  ...SETTINGS_FIELDS.flatMap((field) => ('options' in field ? field.options : [])),
  ...SETTINGS_VALUE.booleans
];
