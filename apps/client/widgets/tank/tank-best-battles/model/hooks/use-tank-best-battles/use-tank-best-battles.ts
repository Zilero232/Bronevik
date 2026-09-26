'use client';

import { useQuery } from '@tanstack/react-query';

import { listBestBattles } from '@/entities/battle/best-battle';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { TANK_BEST_BATTLES } from '../../../config';

export const useTankBestBattles = (tankId: number) => {
  const query = { period: TANK_BEST_BATTLES.period, metric: TANK_BEST_BATTLES.metric, tankId, limit: TANK_BEST_BATTLES.limit };
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.bestBattles.list(query),
    queryFn: ({ signal }) => listBestBattles({ ...query, signal }),
    staleTime: TANK_BEST_BATTLES.staleMs
  });

  return {
    battles: data?.items ?? [],
    allHref: { pathname: ROUTES.bestBattles, query: { tank: String(tankId), period: TANK_BEST_BATTLES.period } },
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
