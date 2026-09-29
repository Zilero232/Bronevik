import { moeSortFieldSchema, sortOrderSchema } from '@otmetki/schemas';
import { parseAsBoolean, parseAsString, parseAsStringLiteral } from 'nuqs/server';

export const MARKS_URL_PARSERS = {
  sort: parseAsStringLiteral(moeSortFieldSchema.options).withDefault('p95'),
  order: parseAsStringLiteral(sortOrderSchema.options).withDefault('desc'),
  q: parseAsString.withDefault(''),
  pinned: parseAsBoolean.withDefault(false)
} as const;

export const PLAYER_URL_PARSER = parseAsString.withDefault('');

export const FORECAST_LINK = {
  calc: 'moe'
} as const;
