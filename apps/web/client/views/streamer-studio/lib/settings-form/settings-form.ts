import type { SettingsGroupKey, SettingsValues } from '@otmetki/schemas';

import { settingsValuesSchema } from '@otmetki/schemas';
import { isEmpty, mergeDeep } from 'remeda';

import type { SettingsField } from '@/entities/streamer/settings';

import { SETTINGS_FIELDS } from '@/entities/streamer/settings';

import type {
  AssignPathInput,
  CompactInput,
  LeafInput,
  MergeSettingsInput,
  ReadPathInput,
  SettingsFormLeaf,
  SettingsFormValues
} from './settings-form.types';

import { SETTINGS_FORM } from '../../config';

const EDITABLE = new Set<string>(SETTINGS_FIELDS.map((field) => field.path));

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

export const readPath = ({ source, path }: ReadPathInput): unknown =>
  path.split('.').reduce<unknown>((node, key) => (isRecord(node) ? node[key] : undefined), source);

const assignPath = ({ target, path, value }: AssignPathInput): void => {
  const keys = path.split('.');
  const last = keys.pop();
  let node = target;

  for (const key of keys) {
    const next = isRecord(node[key]) ? node[key] : {};

    node[key] = next;
    node = next;
  }

  if (last !== undefined) {
    node[last] = value;
  }
};

const compact = ({ value, prefix, drop }: CompactInput): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  const entries = Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix === '' ? key : `${prefix}.${key}`;
    const next = drop.has(path) ? undefined : compact({ value: nested, prefix: path, drop });

    return next === undefined || (isRecord(next) && isEmpty(next)) ? [] : [[key, next] as const];
  });

  return Object.fromEntries(entries);
};

export const toFormLeaf = ({ field, value }: LeafInput): SettingsFormLeaf => {
  switch (field.kind) {
    case 'text': {
      return typeof value === 'string' ? value : '';
    }

    case 'number': {
      return typeof value === 'number' ? value : null;
    }

    case 'enum': {
      return typeof value === 'string' ? value : SETTINGS_FORM.unset;
    }

    case 'boolean': {
      return typeof value === 'boolean' ? String(value) : SETTINGS_FORM.unset;
    }

    case 'multi': {
      return Array.isArray(value) ? value.map(String) : [];
    }
  }
};

const fromFormLeaf = ({ field, value }: LeafInput): unknown => {
  switch (field.kind) {
    case 'text': {
      return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
    }

    case 'number': {
      return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
    }

    case 'enum': {
      return typeof value === 'string' && value !== SETTINGS_FORM.unset ? value : undefined;
    }

    case 'boolean': {
      return value === SETTINGS_FORM.unset || typeof value !== 'string' ? undefined : value === String(true);
    }

    case 'multi': {
      return Array.isArray(value) && value.length > 0 ? value : undefined;
    }
  }
};

export const toSettingsFormValues = (values: unknown): SettingsFormValues => {
  const form: SettingsFormValues = {};

  for (const field of SETTINGS_FIELDS) {
    assignPath({ target: form, path: field.path, value: toFormLeaf({ field, value: readPath({ source: values, path: field.path }) }) });
  }

  return form;
};

export const cleanSettingsForm = (form: unknown): unknown => {
  const values: Record<string, unknown> = {};

  for (const field of SETTINGS_FIELDS) {
    const value = fromFormLeaf({ field, value: readPath({ source: form, path: field.path }) });

    if (value !== undefined) {
      assignPath({ target: values, path: field.path, value });
    }
  }

  return compact({ value: values, prefix: '', drop: new Set() });
};

export const mergeSettings = ({ base, edited }: MergeSettingsInput): SettingsValues => {
  const kept = compact({ value: base, prefix: '', drop: EDITABLE });

  return settingsValuesSchema.parse(compact({ value: mergeDeep(isRecord(kept) ? kept : {}, edited), prefix: '', drop: new Set() }));
};

export const fieldsOfGroup = (group: SettingsGroupKey): SettingsField[] => SETTINGS_FIELDS.filter((field) => field.group === group);
