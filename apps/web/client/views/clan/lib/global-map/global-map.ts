import { sumBy } from 'remeda';

import type { GlobalMap, GlobalMapSummary } from './global-map.types';

import { STRONGHOLD } from '../../config';

export const globalMapSummary = (globalMap: GlobalMap): GlobalMapSummary => ({
  elo: STRONGHOLD.eloTiers.map((tier) => ({ tier, value: globalMap[`eloRating${tier}`] })),
  revenue: globalMap.provinces.length > 0 ? sumBy(globalMap.provinces, (province) => province.dailyRevenue ?? 0) : null
});
