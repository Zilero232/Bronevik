import type { TankClass } from '@otmetki/icons';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { TANK_ROLES } from '@otmetki/schemas';
import { parseAsArrayOf, parseAsInteger, parseAsStringLiteral } from 'nuqs/server';

export const VEHICLE_TIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const VEHICLE_KINDS = ['all', 'regular', 'premium', 'collector'] as const;

export const VEHICLE_KIND_QUERY = {
  all: {},
  regular: { premium: false, collectible: false },
  premium: { premium: true, collectible: false },
  collector: { collectible: true }
} as const satisfies Record<(typeof VEHICLE_KINDS)[number], { premium?: boolean; collectible?: boolean }>;

export const ANY_ROLE = 'any';

export const ROLE_CLASS_PREFIX = {
  heavyTank: 'HT_',
  mediumTank: 'MT_',
  lightTank: 'LT_',
  'AT-SPG': 'ATSPG_',
  SPG: 'SPG'
} as const satisfies Record<TankClass, string>;

export const VEHICLE_FILTER_ICON = {
  reset: 14
} as const;

export const VEHICLE_FILTER_PARSERS = {
  tiers: parseAsArrayOf(parseAsInteger).withDefault([]),
  types: parseAsArrayOf(parseAsStringLiteral(TANK_CLASSES)).withDefault([]),
  nations: parseAsArrayOf(parseAsStringLiteral(NATIONS)).withDefault([]),
  premium: parseAsStringLiteral(VEHICLE_KINDS).withDefault('all'),
  roles: parseAsArrayOf(parseAsStringLiteral(TANK_ROLES)).withDefault([])
} as const;
