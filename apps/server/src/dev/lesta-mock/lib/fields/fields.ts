import { isPlainObject } from 'remeda';

type Json = unknown;

const pickPath = (source: Json, path: readonly string[]): Json => {
  if (path.length === 0) {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((item: Json) => pickPath(item, path));
  }

  if (!isPlainObject(source)) {
    return undefined;
  }

  const [head = '', ...rest] = path;

  if (!(head in source)) {
    return undefined;
  }

  return { [head]: pickPath(source[head], rest) };
};

const deepMerge = (target: Json, source: Json): Json => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return target.map((item: Json, index) => deepMerge(item, source[index]));
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    const merged: Record<string, Json> = { ...target };

    for (const [key, value] of Object.entries(source)) {
      merged[key] = key in merged ? deepMerge(merged[key], value) : value;
    }

    return merged;
  }

  return source ?? target;
};

const dropPath = (source: Json, path: readonly string[]): Json => {
  if (Array.isArray(source)) {
    return source.map((item: Json) => dropPath(item, path));
  }

  if (!isPlainObject(source) || path.length === 0) {
    return source;
  }

  const [head = '', ...rest] = path;

  if (rest.length === 0) {
    return Object.fromEntries(Object.entries(source).filter(([key]) => key !== head));
  }

  return head in source ? { ...source, [head]: dropPath(source[head], rest) } : source;
};

export const parseFields = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((field) => field.trim())
    .filter((field) => field.length > 0);

export const selectFields = (value: Json, fields: readonly string[]): Json => {
  if (fields.length === 0 || value === null || value === undefined) {
    return value;
  }

  const include = fields.filter((field) => !field.startsWith('-'));
  const exclude = fields.filter((field) => field.startsWith('-')).map((field) => field.slice(1));
  const picked =
    include.length === 0 ? value : include.reduce<Json>((merged, field) => deepMerge(merged, pickPath(value, field.split('.'))), undefined);

  return exclude.reduce<Json>((current, field) => dropPath(current, field.split('.')), picked ?? {});
};
