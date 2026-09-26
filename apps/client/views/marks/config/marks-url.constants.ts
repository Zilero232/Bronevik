import { moeSortFieldSchema, sortOrderSchema } from '@otmetki/schemas';
import { parseAsString, parseAsStringLiteral } from 'nuqs';

export const MARKS_URL_PARSERS = {
  sort: parseAsStringLiteral(moeSortFieldSchema.options).withDefault('p95'),
  order: parseAsStringLiteral(sortOrderSchema.options).withDefault('desc'),
  q: parseAsString.withDefault('')
} as const;

export const PLAYER_URL_PARSER = parseAsString.withDefault('');

export const FORECAST_LINK = {
  calc: 'moe'
} as const;
