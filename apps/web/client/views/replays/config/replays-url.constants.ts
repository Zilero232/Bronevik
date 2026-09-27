import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';

import { REPLAY_LIST, REPLAY_RESULTS, REPLAY_SORTS, REPLAY_TABS } from './replays-list.constants';

export const REPLAYS_URL_PARSERS = {
  tab: parseAsStringLiteral(REPLAY_TABS).withDefault(REPLAY_LIST.defaultTab),
  tank: parseAsInteger,
  map: parseAsString,
  mode: parseAsString,
  player: parseAsString.withDefault(''),
  result: parseAsStringLiteral(REPLAY_RESULTS),
  sort: parseAsStringLiteral(REPLAY_SORTS).withDefault(REPLAY_LIST.defaultSort),
  offset: parseAsInteger.withDefault(0)
} as const;
