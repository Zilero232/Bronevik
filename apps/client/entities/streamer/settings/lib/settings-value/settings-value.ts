import type { FlatValue, SettingsGroupKey } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';

import type { SettingsRow } from '../settings-format';
import type { SettingsFieldMessage, SettingsOption, SettingsValueView } from './settings-value.types';

import { SETTINGS_FIELDS, SETTINGS_FORMAT, SETTINGS_VALUE } from '../../config';
import { fieldKey } from '../settings-format';

const OPTIONS: readonly SettingsOption[] = [
  ...SETTINGS_FIELDS.flatMap((field) => ('options' in field ? field.options : [])),
  ...SETTINGS_VALUE.booleans
];

export const settingsOption = (value: FlatValue): SettingsOption | null => OPTIONS.find((option) => option === String(value)) ?? null;

const GROUP_KEYS: ReadonlySet<string> = new Set(STREAMER_SETTINGS.groups);

export const isSettingsGroup = (key: string): key is SettingsGroupKey => GROUP_KEYS.has(key);

export const fieldMessage = (path: string): SettingsFieldMessage => fieldKey(path) as SettingsFieldMessage;

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
