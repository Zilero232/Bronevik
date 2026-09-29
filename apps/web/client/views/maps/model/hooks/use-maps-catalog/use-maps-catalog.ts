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

  const { isPending, filterIds, rowIds } = usePinnedRows({ scope: 'maps', isPinnedOnly: pinned });

  const query = useQuery({
    ...mapQueries.list(),
    select: (catalog) => ({
      maps: filterMaps({
        maps: catalog.map((map) => localizedMap({ map, locale })),
        query: q,
        modes,
        camouflages: camo,
        sizes: size,
        pinnedIds: filterIds
      }),
      total: catalog.length
    })
  });

  return { query, pinnedIds: rowIds, isPinPending: isPending, isFiltered, onReset };
};
