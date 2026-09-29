'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { localizedMap, mapQueries } from '@/entities/map/map';
import { usePinnedRows } from '@/features/app/pin-rows';

import { filterMaps } from '../../../lib/map-filter';
import { useMapFilters } from '../use-map-filters';

export const useMapsCatalog = () => {
  const locale = useLocale();
  const {
    filters: { q, modes, camo, size, pinned },
    isFiltered,
    onReset
  } = useMapFilters();

  const { pinnedIds } = usePinnedRows('maps');

  const query = useQuery({
    ...mapQueries.list(),
    select: (catalog) => ({
      maps: filterMaps({
        maps: catalog.map((map) => localizedMap({ map, locale })),
        query: q,
        modes,
        camouflages: camo,
        sizes: size,
        pinnedIds: pinned ? pinnedIds : null
      }),
      total: catalog.length
    })
  });

  return { query, pinnedIds, isFiltered, onReset };
};
