import type { SupertestParamMeta } from './param-key.types';

import { PARSED_UNITS, SUPERTEST_PARAMS } from '../../config';

const RAW_UNIT_LENGTH = 12;

export const paramOf = (label: string): SupertestParamMeta | null => SUPERTEST_PARAMS.find((param) => param.pattern.test(label.trim())) ?? null;

export const paramMeta = (key: string | null): SupertestParamMeta | null =>
  key === null ? null : (SUPERTEST_PARAMS.find((param) => param.key === key) ?? null);

export const parsedUnit = (text: string): string | null => {
  const trimmed = text.trim().replace(/^[(\s]+/u, '');

  if (trimmed.length === 0) {
    return null;
  }

  const known = PARSED_UNITS.find((entry) => entry.pattern.test(trimmed));

  if (known) {
    return known.unit;
  }

  const word = /^[\p{L}%°./]+/u.exec(trimmed)?.[0] ?? '';

  return word.length > 0 && word.length <= RAW_UNIT_LENGTH ? word : null;
};
