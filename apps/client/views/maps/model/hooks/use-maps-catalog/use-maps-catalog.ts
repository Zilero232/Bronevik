'use client';

import { useQuery } from '@tanstack/react-query';

import { mapQueries } from '@/entities/map/map';

import { filterMaps } from '../../../lib/map-filter';
import { useMapFilters } from '../use-map-filters';

export const useMapsCatalog = () => {
  const {
    filters: { q, modes, camo },
    isFiltered,
    onReset
  } = useMapFilters();

  const { data: catalog = [], isPending, isError, isFetching, refetch } = useQuery(mapQueries.list());

  return {
    maps: filterMaps({ maps: catalog, query: q, modes, camouflages: camo }),
    total: catalog.length,
    isFiltered,
    isPending,
    isError,
    isRetrying: isFetching,
    onReset,
    retry: () => void refetch()
  };
};
