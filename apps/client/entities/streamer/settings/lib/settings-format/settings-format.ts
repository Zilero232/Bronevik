import type { SettingsGroupKey, StreamerSettings } from '@otmetki/schemas';

import { flattenSettings } from '@otmetki/schemas';

import type { SettingsFieldPath, SettingsRow, SettingsTextInput } from './settings-format.types';

import { SETTINGS_FIELDS } from '../../config';

export const fieldKey = (path: string): string => path.replaceAll('.', '_');

export const groupOfPath = (path: string): SettingsGroupKey => path.split('.')[0] as SettingsGroupKey;

export const isKnownField = (path: string): path is SettingsFieldPath => SETTINGS_FIELDS.some((field) => field.path === path);

export const settingsRows = (settings: StreamerSettings, group: SettingsGroupKey): SettingsRow[] => {
  const flat = flattenSettings({ [group]: settings[group] });

  return SETTINGS_FIELDS.flatMap((field) => {
    const value = flat[field.path];

    return field.group === group && value !== undefined && value !== null ? [{ path: field.path, value }] : [];
  });
};

export const settingsAsText = ({ displayName, settings, label, value }: SettingsTextInput): string => {
  const lines = [displayName];

  for (const group of Object.keys(settings) as SettingsGroupKey[]) {
    const rows = settingsRows(settings, group);

    if (rows.length > 0) {
      lines.push('', `[${label(group)}]`, ...rows.map((row) => `${label(row.path)}: ${value(row)}`));
    }
  }

  return lines.join('\n');
};
