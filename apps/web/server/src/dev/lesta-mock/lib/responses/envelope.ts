import type { LestaMockEnvelope } from '../../lesta-mock.types';
import type { FailInput, HasExtraInput, IdListInput, IdListResult, IntParamInput, ListOfInput, OkInput } from './responses.types';

import { RESPONSES } from './responses.constants';

export const ok = ({ data, meta = {} }: OkInput): LestaMockEnvelope => ({ status: 'ok', meta, data });

export const fail = ({ code, message, field = null, value = null }: FailInput): LestaMockEnvelope => ({
  status: 'error',
  error: { code, message, field, value }
});

export const listOf = ({ params, key }: ListOfInput): string[] =>
  (params[key] ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

export const idList = ({ params, field, required = true, limit = RESPONSES.maxIds }: IdListInput): IdListResult => {
  const raw = listOf({ params, key: field });
  const upper = field.toUpperCase();

  if (raw.length === 0) {
    return required ? { error: fail({ code: 402, message: `${upper}_NOT_SPECIFIED`, field }) } : { ids: [] };
  }

  if (raw.length > limit) {
    return { error: fail({ code: 407, message: `${upper}_LIST_LIMIT_EXCEEDED`, field, value: params[field] ?? null }) };
  }

  const invalid = raw.find((part) => !/^\d{1,12}$/.test(part));

  if (invalid !== undefined) {
    return { error: fail({ code: 407, message: `INVALID_${upper}`, field, value: invalid }) };
  }

  return { ids: [...new Set(raw.map(Number))] };
};

export const intParam = ({ params, key, fallback }: IntParamInput): number => {
  const value = Number.parseInt(params[key] ?? '', 10);

  return Number.isFinite(value) ? value : fallback;
};

export const hasExtra = ({ context, extra }: HasExtraInput): boolean => context.extra.includes(extra);
