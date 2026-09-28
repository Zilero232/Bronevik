'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { directoryQueries } from '../../../api';
import { directoryEntry } from '../../../lib/directory-entry';
import { directoryQuery } from '../../../lib/directory-query';
import { useDirectoryFilters } from '../use-directory-filters';

export const useStreamersDirectory = () => {
  const { filters, hasFilters, reset } = useDirectoryFilters();
  const { data: catalog } = useVehicleCatalog();
  const params = directoryQuery(filters);
  const query = useInfiniteQuery(directoryQueries.list(params));

  const { data: directory, fetchNextPage } = query;
  const index = vehicleIndex(catalog);
  const entries = (directory?.pages.flatMap(({ items }) => items) ?? []).map((card) => directoryEntry({ card, index }));

  return {
    query,
    entries,
    hasFilters,
    loadMore: () => void fetchNextPage(),
    reset
  };
};
