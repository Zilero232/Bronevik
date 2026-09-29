import { NATIONS } from '@otmetki/icons';
import { parseAsInteger, parseAsStringLiteral } from 'nuqs/server';

const TREE_DEFAULTS = {
  nation: 'ussr'
} as const;

export const TREE_PARAMS = {
  nation: parseAsStringLiteral(NATIONS).withDefault(TREE_DEFAULTS.nation),
  tank: parseAsInteger
} as const;
