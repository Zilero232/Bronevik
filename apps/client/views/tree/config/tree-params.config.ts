import { NATIONS } from '@bronevik/icons';
import { parseAsInteger, parseAsStringLiteral } from 'nuqs';

export const DEFAULT_NATION = 'ussr';

export const TREE_PARAMS = {
  nation: parseAsStringLiteral(NATIONS).withDefault(DEFAULT_NATION),
  tank: parseAsInteger
};
