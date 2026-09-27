'use client';

import { useQuery } from '@tanstack/react-query';

import { listBestBattles } from '@/entities/battle/best-battle';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { TANK_BEST_BATTLES } from '../../../config';

export const useTankBestBattles = (tankId: number) => {
  const params = { period: TANK_BEST_BATTLES.period, metric: TANK_BEST_BATTLES.metric, tankId, limit: TANK_BEST_BATTLES.limit };
  const query = useQuery({
    queryKey: QUERY_KEYS.bestBattles.list(params),
    queryFn: ({ signal }) => listBestBattles({ ...params, signal }),
    staleTime: TANK_BEST_BATTLES.staleMs,
    select: ({ items }) => items
  });

  return { query, allHref: { pathname: ROUTES.bestBattles, query: { tank: String(tankId), period: TANK_BEST_BATTLES.period } } };
};
