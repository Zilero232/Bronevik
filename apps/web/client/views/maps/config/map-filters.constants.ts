import { parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringLiteral } from 'nuqs/server';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';

export const MAP_SIZES = ['small', 'medium', 'large'] as const;

export const MAP_SIZE_BOUNDS = {
  smallMax: 800,
  largeMin: 1200
} as const;

export const MAP_FILTER_PARSERS = {
  q: parseAsString.withDefault(''),
  modes: parseAsArrayOf(parseAsStringLiteral(MAP_MODE_KINDS)).withDefault([]),
  camo: parseAsArrayOf(parseAsStringLiteral(MAP_CAMOUFLAGES)).withDefault([]),
  size: parseAsArrayOf(parseAsStringLiteral(MAP_SIZES)).withDefault([]),
  pinned: parseAsBoolean.withDefault(false)
} as const;

export const MAPS_TABLE = {
  pinWidth: 40
} as const;
