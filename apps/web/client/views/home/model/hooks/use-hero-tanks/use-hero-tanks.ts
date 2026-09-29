'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useHeroTanks = () => {
  const params = {
    period: HOME.period.server,
    tiers: [HOME.strongTanks.tiers[0]],
    sort: HOME.strongTanks.sort,
    order: HOME.strongTanks.order,
    limit: HOME.strongTanks.limit
  };

  const { data } = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, tiers: [...params.tiers], signal })
  });

  const rows = (data?.items ?? []).slice(0, HOME.hero.tanks);

  return { rows, lead: rows.at(0), hasShowcase: rows.length > 0 };
};
