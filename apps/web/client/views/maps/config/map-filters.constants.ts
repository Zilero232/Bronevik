import { parseAsArrayOf, parseAsString, parseAsStringLiteral } from 'nuqs';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';

export const MAP_FILTER_PARSERS = {
  q: parseAsString.withDefault(''),
  modes: parseAsArrayOf(parseAsStringLiteral(MAP_MODE_KINDS)).withDefault([]),
  camo: parseAsArrayOf(parseAsStringLiteral(MAP_CAMOUFLAGES)).withDefault([])
} as const;
