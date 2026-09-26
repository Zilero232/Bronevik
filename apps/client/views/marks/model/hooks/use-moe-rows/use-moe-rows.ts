'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { listMoe } from '@/entities/player/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { MOE_LIST } from '../../../config';
import { nextOffset } from '../../../lib/moe-pages';
import { filterByName, latestUpdate } from '../../../lib/moe-rows';
import { useFetchAllPages } from '../use-fetch-all-pages';
import { useMarksUrlState } from '../use-marks-url-state';

export const useMoeRows = () => {
  const { query } = useVehicleFilters();
  const [{ sort, order, q }] = useMarksUrlState();
  const params = { ...query, sort, order };

  const { data, isPending, isError, isFetching, isPlaceholderData, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.marks.list(params),
    queryFn: ({ signal, pageParam }) => listMoe({ ...params, limit: MOE_LIST.pageLimit, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    placeholderData: keepPreviousData
  });

  useFetchAllPages({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const all = data?.pages.flatMap(({ items }) => items) ?? [];

  return {
    rows: filterByName({ rows: all, query: q }),
    total: data?.pages[0]?.total ?? 0,
    updatedAt: latestUpdate(all),
    isPending,
    isError,
    isRetrying: isFetching,
    isStale: isPlaceholderData,
    refetch
  };
};
