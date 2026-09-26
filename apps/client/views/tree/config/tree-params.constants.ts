import { NATIONS } from '@bronevik/icons';
import { parseAsInteger, parseAsStringLiteral } from 'nuqs';

export const TREE_DEFAULTS = {
  nation: 'ussr'
} as const;

export const TREE_PARAMS = {
  nation: parseAsStringLiteral(NATIONS).withDefault(TREE_DEFAULTS.nation),
  tank: parseAsInteger
};
