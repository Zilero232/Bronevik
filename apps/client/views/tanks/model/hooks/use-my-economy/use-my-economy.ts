'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyEconomy } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { TANKS_ECONOMY } from '../../../config';

export const useMyEconomy = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.tanks.myEconomy(TANKS_ECONOMY.myDays),
    queryFn: ({ signal }) => getMyEconomy({ days: TANKS_ECONOMY.myDays, signal })
  });

  const tanks = query.data?.tanks.slice(0, TANKS_ECONOMY.myTanks) ?? [];

  return { ...query, tanks, days: TANKS_ECONOMY.myDays };
};
