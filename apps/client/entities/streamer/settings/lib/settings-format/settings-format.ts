import type { SettingsGroupKey } from '@otmetki/schemas';

import { flattenSettings, STREAMER_SETTINGS } from '@otmetki/schemas';

import type { SettingsFieldPath, SettingsRow, SettingsRowsInput, SettingsTextInput } from './settings-format.types';

import { SETTINGS_FIELDS } from '../../config';

export const fieldKey = (path: string): string => path.replaceAll('.', '_');

export const isKnownField = (path: string): path is SettingsFieldPath => SETTINGS_FIELDS.some((field) => field.path === path);

export const groupOfPath = (path: SettingsFieldPath): SettingsGroupKey | null => SETTINGS_FIELDS.find((field) => field.path === path)?.group ?? null;

export const settingsRows = ({ settings, group }: SettingsRowsInput): SettingsRow[] => {
  const flat = flattenSettings({ [group]: settings[group] });

  return SETTINGS_FIELDS.flatMap((field) => {
    const value = flat[field.path];

    return field.group === group && value !== undefined && value !== null ? [{ path: field.path, value }] : [];
  });
};

export const settingsAsText = ({ displayName, settings, label, value }: SettingsTextInput): string => {
  const lines = [displayName];

  for (const group of STREAMER_SETTINGS.groups) {
    const rows = settingsRows({ settings, group });

    if (rows.length > 0) {
      lines.push('', `[${label(group)}]`, ...rows.map((row) => `${label(row.path)}: ${value(row)}`));
    }
  }

  return lines.join('\n');
};
