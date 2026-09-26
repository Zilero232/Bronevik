'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { listCoaches } from '@/shared/api/coaching';
import { QUERY_KEYS } from '@/shared/constants';
import { nextPageOffset } from '@/shared/lib';

import { COACHING_LIST } from '../../../config';

export const useCoachList = () => {
  const [tankId, setTankId] = useQueryState('tank', parseAsInteger.withOptions({ history: 'replace' }));
  const { data: catalog } = useVehicleCatalog();
  const query = tankId === null ? {} : { tankId };
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.coaching.list({ ...query, limit: COACHING_LIST.pageSize }),
    queryFn: ({ signal, pageParam }) => listCoaches({ ...query, limit: COACHING_LIST.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    placeholderData: keepPreviousData
  });

  return {
    vehicle: tankId === null ? null : (vehicleIndex(catalog)[tankId] ?? null),
    items: data?.pages.flatMap((page) => page.items) ?? [],
    isFiltered: tankId !== null,
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    onVehicleChange: (vehicle: VehicleSummary | null) => void setTankId(vehicle?.tankId ?? null),
    onReset: () => void setTankId(null),
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
