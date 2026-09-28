import { parseAsNumberLiteral, parseAsStringLiteral } from 'nuqs/server';

import { MAP_STATS } from './map-stats.constants';

export const MAP_STATS_FILTERS = {
  tier: parseAsNumberLiteral(MAP_STATS.tiers).withDefault(MAP_STATS.allTiers),
  mode: parseAsStringLiteral(MAP_STATS.modes).withDefault(MAP_STATS.defaultMode)
};
