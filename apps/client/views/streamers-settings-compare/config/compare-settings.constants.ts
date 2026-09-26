import { parseAsBoolean, parseAsString } from 'nuqs';

export const COMPARE_SLOTS = ['a', 'b', 'c', 'd'] as const;

export const COMPARE_SETTINGS_PARAMS = {
  a: parseAsString,
  b: parseAsString,
  c: parseAsString,
  d: parseAsString,
  me: parseAsBoolean.withDefault(false)
} as const;

export const COMPARE_SETTINGS_PAGE = {
  addValue: '',
  iconSize: 14
} as const;
