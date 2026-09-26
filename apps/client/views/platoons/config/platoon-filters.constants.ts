import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';

import { PLATOON_VOICE } from './platoons.constants';

export const PLATOON_FILTER_PARSERS = {
  tier: parseAsInteger,
  mode: parseAsString,
  voice: parseAsStringLiteral(PLATOON_VOICE).withDefault('any'),
  minWn8: parseAsInteger,
  maxWn8: parseAsInteger,
  at: parseAsString
};
