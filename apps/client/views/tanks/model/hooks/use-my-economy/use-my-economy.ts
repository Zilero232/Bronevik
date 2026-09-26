'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyEconomy } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { TANKS_ECONOMY } from '../../../config';

export const useMyEconomy = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.tanks.myEconomy(TANKS_ECONOMY.myDays),
    queryFn: ({ signal }) => getMyEconomy({ days: TANKS_ECONOMY.myDays, signal })
  });

  const tanks = query.data?.tanks.slice(0, TANKS_ECONOMY.myTanks) ?? [];

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isRetrying: query.isFetching,
    onRetry: () => void query.refetch(),
    tanks,
    days: TANKS_ECONOMY.myDays
  };
};
