'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useHeroTanks = () => {
  const params = {
    period: HOME.period.server,
    tiers: [HOME.strongTanks.tiers[0]],
    sort: 'winRate',
    order: 'desc',
    limit: HOME.strongTanks.limit
  } as const;

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, tiers: [...params.tiers], signal })
  });

  const rows = (data?.items ?? []).slice(0, HOME.hero.tanks);

  return { rows, isEmpty: !isPending && rows.length === 0 };
};
