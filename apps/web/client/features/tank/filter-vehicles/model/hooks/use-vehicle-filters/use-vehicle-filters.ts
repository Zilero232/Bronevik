'use client';

import { useQueryStates } from 'nuqs';

import { VEHICLE_FILTER_PARSERS } from '../../../config';
import { vehicleQuery } from '../../../lib';

export const useVehicleFilters = () => {
  const [filters, setFilters] = useQueryStates(VEHICLE_FILTER_PARSERS, { history: 'replace' });

  const query = vehicleQuery(filters);

  const isActive = Object.values(query).some((values) => values.length > 0);

  return { filters, query, isActive, setFilters, reset: () => setFilters(null) };
};
