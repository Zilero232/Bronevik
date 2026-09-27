'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';

import { getStreamerDirectory } from '../../../api';
import { DIRECTORY } from '../../../config';
import { directoryEntry } from '../../../lib/directory-entry';
import { directoryQuery } from '../../../lib/directory-query';
import { useDirectoryFilters } from '../use-directory-filters';

export const useStreamersDirectory = () => {
  const { filters, hasFilters, reset } = useDirectoryFilters();
  const { data: catalog } = useVehicleCatalog();
  const params = directoryQuery(filters);
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.streamers.directory(params),
    queryFn: ({ pageParam }) => getStreamerDirectory({ ...params, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    staleTime: DIRECTORY.staleMs
  });

  const index = vehicleIndex(catalog);
  const entries = (query.data?.pages.flatMap(({ items }) => items) ?? []).map((card) => directoryEntry({ card, index }));

  return {
    query,
    entries,
    hasFilters,
    loadMore: () => void query.fetchNextPage(),
    reset
  };
};
