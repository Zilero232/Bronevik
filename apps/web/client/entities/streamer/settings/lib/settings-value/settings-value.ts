import type { FlatValue, SettingsGroupKey } from '@otmetki/schemas';

import { STREAMER_SETTINGS, STREAMER_SETTINGS_AGGREGATE_FIELDS } from '@otmetki/schemas';
import { isIncludedIn } from 'remeda';

import type { SettingsRow } from '../settings-format';
import type { SettingsFieldMessage, SettingsOption, SettingsValueView } from './settings-value.types';

import { SETTINGS_FIELDS, SETTINGS_FORMAT, SETTINGS_OPTIONS, SETTINGS_VALUE } from '../../config';
import { fieldKey } from '../settings-format';

export const settingsOption = (value: FlatValue): SettingsOption | null => SETTINGS_OPTIONS.find((option) => option === String(value)) ?? null;

export const isSettingsGroup = (key: string): key is SettingsGroupKey => isIncludedIn(key, STREAMER_SETTINGS.groups);

const isFieldMessage = (key: string): key is SettingsFieldMessage =>
  [...SETTINGS_FIELDS.map((field) => field.path), ...STREAMER_SETTINGS_AGGREGATE_FIELDS.map((field) => field.field)].some(
    (path) => fieldKey(path) === key
  );

export const fieldMessage = (path: string): SettingsFieldMessage | null => {
  const key = fieldKey(path);

  return isFieldMessage(key) ? key : null;
};

const listItems = (value: FlatValue): string[] =>
  String(value)
    .split(SETTINGS_FORMAT.listSeparator)
    .map((item) => item.trim())
    .filter(Boolean);

export const settingsValueView = ({ path, value }: SettingsRow): SettingsValueView => {
  const field = SETTINGS_FIELDS.find((candidate) => candidate.path === path);

  if (value === null) {
    return { kind: 'text', text: SETTINGS_FORMAT.missing };
  }

  if (typeof value === 'boolean') {
    return { kind: 'options', options: [value ? 'true' : 'false'], isList: false };
  }

  if (typeof value === 'number') {
    return {
      kind: 'number',
      value,
      unit: field && 'unit' in field ? field.unit : null,
      digits: path.startsWith(SETTINGS_VALUE.sensitivityPrefix) ? SETTINGS_FORMAT.sensitivityDigits : null
    };
  }

  if (field?.kind === 'multi') {
    const items = listItems(value);
    const options = items.map(settingsOption);

    return options.every((option) => option !== null) ? { kind: 'options', options, isList: true } : { kind: 'list', items };
  }

  const option = field?.kind === 'enum' ? settingsOption(value) : null;

  return option ? { kind: 'options', options: [option], isList: false } : { kind: 'text', text: value };
};
