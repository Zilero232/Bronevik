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

  const query = useQuery({
    ...mapQueries.list(),
    select: (catalog) => ({ maps: filterMaps({ maps: catalog, query: q, modes, camouflages: camo }), total: catalog.length })
  });

  return { query, isFiltered, onReset };
};
