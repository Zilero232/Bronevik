import type {
  ApplyValuesInput,
  ChangedGroupsInput,
  FlatSettings,
  FlatValue,
  SettingsDiffRow,
  SettingsGroupKey,
  SettingsValues,
  StreamerSettings
} from './streamer-settings.types';

import { STREAMER_SETTINGS } from './streamer-settings.constants';
import { settingsGroupKeySchema, settingsValuesSchema } from './streamer-settings.schemas';

const PROVENANCE_KEYS = new Set(['source', 'sourceUrl', 'checkedAt']);

const isPlainObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isFlatValue = (value: unknown): value is FlatValue =>
  value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string';

const groupOrder = (field: string): number => {
  const parsed = settingsGroupKeySchema.safeParse(field.split('.')[0]);

  return parsed.success ? STREAMER_SETTINGS.groups.indexOf(parsed.data) : -1;
};

const flatten = (value: unknown, prefix: string, target: FlatSettings): void => {
  if (value === undefined) {
    return;
  }

  if (isPlainObject(value)) {
    for (const [key, nested] of Object.entries(value)) {
      if (!PROVENANCE_KEYS.has(key)) {
        flatten(nested, prefix === '' ? key : `${prefix}.${key}`, target);
      }
    }

    return;
  }

  if (Array.isArray(value)) {
    target[prefix] = value.map(String).join(', ');

    return;
  }

  target[prefix] = isFlatValue(value) ? value : String(value);
};

export const flattenSettings = (settings: SettingsValues | StreamerSettings): FlatSettings => {
  const target: FlatSettings = {};

  flatten(settings, '', target);

  return target;
};

export const zoomMax = (steps: readonly string[] | undefined): (typeof STREAMER_SETTINGS.zoomSteps)[number] | null => {
  const found = STREAMER_SETTINGS.zoomSteps.filter((step) => steps?.includes(step));

  return found.at(-1) ?? null;
};

export const diffSettings = (list: readonly (SettingsValues | StreamerSettings)[]): SettingsDiffRow[] => {
  const flats = list.map(flattenSettings);
  const fields = [...new Set(flats.flatMap((flat) => Object.keys(flat)))];

  return fields
    .sort((left, right) => groupOrder(left) - groupOrder(right) || left.localeCompare(right))
    .map((field) => {
      const values = flats.map((flat) => flat[field] ?? null);
      const present = values.filter((value) => value !== null).map(String);

      return { field, values, differs: new Set(present).size > 1 || (present.length > 0 && present.length < values.length) };
    });
};

export const toSettingsValues = (settings: StreamerSettings): SettingsValues => settingsValuesSchema.parse(settings);

export const valuesForApply = ({ values, groups, includeResolution, includeSensitivity }: ApplyValuesInput): SettingsValues => {
  const picked: SettingsValues = {};

  for (const group of groups) {
    if (group === 'display' && values.display) {
      const { resolution, refreshRate, windowMode, ...rest } = values.display;

      picked.display = includeResolution ? { resolution, refreshRate, windowMode, ...rest } : rest;
    } else if (group === 'controls' && values.controls) {
      const { sensitivity, ...rest } = values.controls;

      picked.controls = includeSensitivity ? { sensitivity, ...rest } : rest;
    } else if (values[group]) {
      Object.assign(picked, { [group]: values[group] });
    }
  }

  return settingsValuesSchema.parse(JSON.parse(JSON.stringify(picked)));
};

export const changedGroups = ({ previous, next }: ChangedGroupsInput): SettingsGroupKey[] =>
  STREAMER_SETTINGS.groups.filter((group) => JSON.stringify(previous?.[group] ?? null) !== JSON.stringify(next[group] ?? null));
