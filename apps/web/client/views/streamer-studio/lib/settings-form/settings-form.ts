import type { SettingsGroupKey, SettingsValues } from '@otmetki/schemas';

import { settingsValuesSchema } from '@otmetki/schemas';
import { isEmpty, isPlainObject, mergeDeep } from 'remeda';
import { match } from 'ts-pattern';

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

export const readPath = ({ source, path }: ReadPathInput): unknown =>
  path.split('.').reduce<unknown>((node, key) => (isPlainObject(node) ? node[key] : undefined), source);

const assignPath = ({ target, path, value }: AssignPathInput): void => {
  const keys = path.split('.');
  const last = keys.pop();
  let node = target;

  for (const key of keys) {
    const next = isPlainObject(node[key]) ? node[key] : {};

    node[key] = next;
    node = next;
  }

  if (last !== undefined) {
    node[last] = value;
  }
};

const compact = ({ value, prefix, drop }: CompactInput): unknown => {
  if (!isPlainObject(value)) {
    return value;
  }

  const entries = Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix === '' ? key : `${prefix}.${key}`;
    const next = drop.has(path) ? undefined : compact({ value: nested, prefix: path, drop });

    return next === undefined || (isPlainObject(next) && isEmpty(next)) ? [] : [[key, next] as const];
  });

  return Object.fromEntries(entries);
};

export const toFormLeaf = ({ field, value }: LeafInput): SettingsFormLeaf =>
  match(field.kind)
    .with('text', () => (typeof value === 'string' ? value : ''))
    .with('number', () => (typeof value === 'number' ? value : null))
    .with('enum', () => (typeof value === 'string' ? value : SETTINGS_FORM.unset))
    .with('boolean', () => (typeof value === 'boolean' ? String(value) : SETTINGS_FORM.unset))
    .with('multi', () => (Array.isArray(value) ? value.map(String) : []))
    .exhaustive();

const fromFormLeaf = ({ field, value }: LeafInput): unknown =>
  match(field.kind)
    .with('text', () => (typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined))
    .with('number', () => (typeof value === 'number' && Number.isFinite(value) ? value : undefined))
    .with('enum', () => (typeof value === 'string' && value !== SETTINGS_FORM.unset ? value : undefined))
    .with('boolean', () => (value === SETTINGS_FORM.unset || typeof value !== 'string' ? undefined : value === String(true)))
    .with('multi', () => (Array.isArray(value) && value.length > 0 ? value : undefined))
    .exhaustive();

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

  return settingsValuesSchema.parse(compact({ value: mergeDeep(isPlainObject(kept) ? kept : {}, edited), prefix: '', drop: new Set() }));
};

export const fieldsOfGroup = (group: SettingsGroupKey): SettingsField[] => SETTINGS_FIELDS.filter((field) => field.group === group);
