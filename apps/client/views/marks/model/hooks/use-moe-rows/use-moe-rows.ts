'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { listMoe } from '@/entities/player/marks';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

import { MOE_LIST } from '../../../config';
import { nextOffset } from '../../../lib/moe-pages';
import { filterByName, latestUpdate } from '../../../lib/moe-rows';
import { useFetchAllPages } from '../use-fetch-all-pages';
import { useMarksUrlState } from '../use-marks-url-state';

export const useMoeRows = () => {
  const filters = useVehicleFilters();
  const [{ sort, order, q }] = useMarksUrlState();
  const params = { ...filters.query, sort, order };

  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.marks.list(params),
    queryFn: ({ signal, pageParam }) => listMoe({ ...params, limit: MOE_LIST.pageLimit, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    placeholderData: keepPreviousData
  });

  useFetchAllPages(query);

  const all = query.data?.pages.flatMap(({ items }) => items) ?? [];

  return {
    rows: filterByName({ rows: all, query: q }),
    total: query.data?.pages[0]?.total ?? 0,
    updatedAt: latestUpdate(all),
    query
  };
};
