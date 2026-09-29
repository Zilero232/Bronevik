'use client';

import { useQueryStates } from 'nuqs';

import { VEHICLE_FILTER_PARSERS } from '../../../config';
import { vehicleQuery, vehicleTraitQuery } from '../../../lib';

export const useVehicleFilters = () => {
  const [filters, setFilters] = useQueryStates(VEHICLE_FILTER_PARSERS, { history: 'replace' });

  const query = vehicleQuery(filters);
  const traitQuery = vehicleTraitQuery(filters);

  const isActive = filters.tiers.length + filters.types.length + filters.nations.length + filters.roles.length > 0 || filters.premium !== 'all';

  return { filters, query, traitQuery, isActive, setFilters, reset: () => setFilters(null) };
};
