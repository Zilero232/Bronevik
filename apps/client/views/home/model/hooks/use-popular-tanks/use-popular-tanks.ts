'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const usePopularTanks = () => {
  const params = { period: HOME.period.server, sort: 'battles', order: 'desc', limit: HOME.garage.limit } as const;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, signal })
  });

  return { rows: data?.items ?? [], isPending, isError, retry: () => void refetch() };
};
