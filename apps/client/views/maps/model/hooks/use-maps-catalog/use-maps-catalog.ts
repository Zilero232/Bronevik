'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';
import { listMaps } from '@/shared/api/maps';
import { QUERY_KEYS } from '@/shared/constants';

import { filterMaps } from '../../../lib/map-filter';

const MAP_FILTER_PARSERS = {
  q: parseAsString.withDefault(''),
  modes: parseAsArrayOf(parseAsStringLiteral(MAP_MODE_KINDS)).withDefault([]),
  camo: parseAsArrayOf(parseAsStringLiteral(MAP_CAMOUFLAGES)).withDefault([])
};

export const useMapsCatalog = () => {
  const [filters, setFilters] = useQueryStates(MAP_FILTER_PARSERS, { history: 'replace' });
  const {
    data: catalog,
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.maps.list,
    queryFn: ({ signal }) => listMaps({ signal })
  });

  const all = catalog ?? [];
  const { q, modes, camo } = filters;

  return {
    filters,
    maps: filterMaps({ maps: all, query: q, modes, camouflages: camo }),
    total: all.length,
    isFiltered: q.length > 0 || modes.length > 0 || camo.length > 0,
    isPending,
    isError,
    isRetrying: isFetching,
    setFilters: (patch: Partial<typeof filters>) => void setFilters(patch),
    reset: () => void setFilters(null),
    retry: () => void refetch()
  };
};
