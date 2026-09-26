'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyBattle } from '@/entities/player/analytics';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

export const useMyBattle = (id: string) => {
  const query = useQuery({ queryKey: QUERY_KEYS.me.analytics.battle(id), queryFn: ({ signal }) => getMyBattle({ id, signal }) });

  return {
    battle: query.data,
    isPending: query.isPending,
    isNotFound: isNotFoundError(query.error),
    isRetrying: query.isFetching,
    retry: () => void query.refetch()
  };
};
