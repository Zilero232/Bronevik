'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { getStreamerDirectory } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { DIRECTORY } from '../../../config';
import { directoryEntry } from '../../../lib/directory-entry';
import { directoryQuery } from '../../../lib/directory-query';
import { useDirectoryFilters } from '../use-directory-filters';

export const useStreamersDirectory = () => {
  const { filters, hasFilters, reset } = useDirectoryFilters();
  const { data: catalog } = useVehicleCatalog();
  const query = directoryQuery(filters);
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.streamers.directory(query),
    queryFn: ({ pageParam }) => getStreamerDirectory({ ...query, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    staleTime: DIRECTORY.staleMs
  });

  const index = vehicleIndex(catalog);
  const entries = (data?.pages.flatMap(({ items }) => items) ?? []).map((card) => directoryEntry({ card, index }));

  return {
    entries,
    hasFilters,
    isPending,
    isError,
    isRetrying: isFetching,
    isEmpty: !isPending && !isError && entries.length === 0,
    hasNextPage,
    isFetchingNextPage,
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch(),
    reset
  };
};
