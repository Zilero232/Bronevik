'use client';

import { useQueryStates } from 'nuqs';

import { PREMIUM_VALUE, VEHICLE_FILTER_PARSERS } from '../../../config';

export const useVehicleFilters = () => {
  const [filters, setFilters] = useQueryStates(VEHICLE_FILTER_PARSERS, { history: 'replace' });

  const query = {
    tiers: filters.tiers,
    types: filters.types,
    nations: filters.nations,
    premium: PREMIUM_VALUE[filters.premium]
  };

  const isActive = filters.tiers.length + filters.types.length + filters.nations.length > 0 || filters.premium !== 'all';

  return { filters, query, isActive, setFilters, reset: () => setFilters(null) };
};
