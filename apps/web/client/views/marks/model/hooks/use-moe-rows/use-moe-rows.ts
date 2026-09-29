'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { usePinnedRows } from '@/features/app/pin-rows';
import { useVehicleFilters, useVehicleTraitFilter } from '@/features/tank/filter-vehicles';

import { marksQueries } from '../../../api';
import { moeFeedParams } from '../../../lib/moe-feed-params';
import { filterByName, latestUpdate } from '../../../lib/moe-rows';
import { useFetchAllPages } from '../use-fetch-all-pages';
import { useMarksUrlState } from '../use-marks-url-state';

export const useMoeRows = () => {
  const filters = useVehicleFilters();
  const byTraits = useVehicleTraitFilter();
  const [{ sort, order, q, pinned }] = useMarksUrlState();
  const { pinnedIds } = usePinnedRows('tanks');

  const query = useInfiniteQuery({ ...marksQueries.feed(moeFeedParams({ vehicle: filters.query, sort, order })), placeholderData: keepPreviousData });

  useFetchAllPages(query);

  const { data: feed } = query;
  const all = feed?.pages.flatMap(({ items }) => items) ?? [];
  const total = feed?.pages[0]?.total ?? 0;
  const named = byTraits({ rows: filterByName({ rows: all, query: q }), vehicleOf: ({ vehicle }) => vehicle });

  return {
    rows: pinned ? named.filter(({ vehicle }) => pinnedIds.includes(String(vehicle.tankId))) : named,
    pinnedIds,
    total,
    isUntracked: total === 0 && !filters.isActive && q.trim() === '',
    updatedAt: latestUpdate(all),
    query
  };
};
