import type { MatchesFilterInput } from './catalog-entry.types';

import { VEHICLE_TYPE_TO_DB } from '../../../../common/lib';

export const matchesFilter = ({ entry, filter }: MatchesFilterInput): boolean => {
  const { summary } = entry;

  if (filter.tiers?.length && !filter.tiers.includes(summary.tier)) {
    return false;
  }

  if (filter.types?.length && !filter.types.some((type) => VEHICLE_TYPE_TO_DB[type] === entry.dbType)) {
    return false;
  }

  if (filter.nations?.length && !filter.nations.includes(summary.nation)) {
    return false;
  }

  if (filter.premium !== undefined && summary.isPremium !== filter.premium) {
    return false;
  }

  return filter.collectible === undefined || summary.isCollectible === filter.collectible;
};
