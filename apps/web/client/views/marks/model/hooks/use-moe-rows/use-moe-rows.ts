'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { marksQueries } from '../../../api';
import { moeFeedParams } from '../../../lib/moe-feed-params';
import { filterByName, latestUpdate } from '../../../lib/moe-rows';
import { useFetchAllPages } from '../use-fetch-all-pages';
import { useMarksUrlState } from '../use-marks-url-state';

export const useMoeRows = () => {
  const filters = useVehicleFilters();
  const [{ sort, order, q }] = useMarksUrlState();

  const query = useInfiniteQuery({ ...marksQueries.feed(moeFeedParams({ vehicle: filters.query, sort, order })), placeholderData: keepPreviousData });

  useFetchAllPages(query);

  const { data: feed } = query;
  const all = feed?.pages.flatMap(({ items }) => items) ?? [];

  return {
    rows: filterByName({ rows: all, query: q }),
    total: feed?.pages[0]?.total ?? 0,
    updatedAt: latestUpdate(all),
    query
  };
};
