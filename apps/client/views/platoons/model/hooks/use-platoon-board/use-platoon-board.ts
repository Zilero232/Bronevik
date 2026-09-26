'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { listPlatoons } from '@/shared/api/platoons';
import { QUERY_KEYS } from '@/shared/constants';
import { nextPageOffset } from '@/shared/lib';

import { PLATOON_BOARD } from '../../../config';
import { toPlatoonQuery } from '../../../lib/platoon-query';
import { usePlatoonFilters } from '../use-platoon-filters';

export const usePlatoonBoard = () => {
  const { filters, isFiltered, onReset } = usePlatoonFilters();
  const query = toPlatoonQuery(filters);
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.platoons.list({ ...query, limit: PLATOON_BOARD.pageSize }),
    queryFn: ({ signal, pageParam }) => listPlatoons({ ...query, limit: PLATOON_BOARD.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    placeholderData: keepPreviousData
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items,
    total: data?.pages[0]?.total ?? 0,
    isFiltered,
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    onReset,
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
