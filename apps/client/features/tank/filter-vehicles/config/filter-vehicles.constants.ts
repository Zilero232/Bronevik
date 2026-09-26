import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { parseAsArrayOf, parseAsInteger, parseAsStringLiteral } from 'nuqs';

export const VEHICLE_TIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const PREMIUM_FILTERS = ['all', 'regular', 'premium'] as const;

export const PREMIUM_VALUE = { all: undefined, regular: false, premium: true } as const;

export const VEHICLE_FILTER_ICON = {
  reset: 14
} as const;

export const VEHICLE_FILTER_PARSERS = {
  tiers: parseAsArrayOf(parseAsInteger).withDefault([]),
  types: parseAsArrayOf(parseAsStringLiteral(TANK_CLASSES)).withDefault([]),
  nations: parseAsArrayOf(parseAsStringLiteral(NATIONS)).withDefault([]),
  premium: parseAsStringLiteral(PREMIUM_FILTERS).withDefault('all')
} as const;
