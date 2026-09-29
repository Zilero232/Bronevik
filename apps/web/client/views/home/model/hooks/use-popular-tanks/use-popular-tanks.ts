'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const usePopularTanks = () => {
  const params = { period: HOME.period.server, sort: HOME.garage.sort, order: HOME.garage.order, limit: HOME.garage.limit };

  return useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, signal }),
    select: ({ items }) => items
  });
};
