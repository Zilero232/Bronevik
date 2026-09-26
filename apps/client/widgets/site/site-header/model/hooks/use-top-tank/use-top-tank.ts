'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { NAV_MENU } from '../../../config';

export const useTopTank = () => {
  const params = {
    period: NAV_MENU.featuredPeriod,
    tiers: [NAV_MENU.featuredTier],
    sort: 'winRate',
    order: 'desc',
    limit: NAV_MENU.featuredLimit
  } as const;

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, tiers: [...params.tiers], signal }),
    staleTime: NAV_MENU.featuredStaleMs
  });

  return { row: data?.items[0] ?? null, isPending };
};
