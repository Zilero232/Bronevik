'use client';

import type { Nation, TankClass } from '@bronevik/icons';

import { useQueryStates } from 'nuqs';

import type { PREMIUM_FILTERS } from '../../config';

import { VEHICLE_FILTER_PARSERS } from '../../config';

export type PremiumFilter = (typeof PREMIUM_FILTERS)[number];

export type VehicleFilterValues = {
  tiers: number[];
  types: TankClass[];
  nations: Nation[];
  premium: PremiumFilter;
};

const PREMIUM_VALUE = { all: undefined, regular: false, premium: true } as const;

export const useVehicleFilters = () => {
  const [filters, setFilters] = useQueryStates(VEHICLE_FILTER_PARSERS, { history: 'replace' });

  const query = {
    tiers: filters.tiers,
    types: filters.types,
    nations: filters.nations,
    premium: PREMIUM_VALUE[filters.premium]
  };

  const isActive = filters.tiers.length + filters.types.length + filters.nations.length > 0 || filters.premium !== 'all';

  const reset = () => setFilters(null);

  return { filters, query, isActive, setFilters, reset };
};
