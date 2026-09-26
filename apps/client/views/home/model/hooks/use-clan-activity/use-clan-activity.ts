'use client';

import { useQuery } from '@tanstack/react-query';

import { listClans } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useClanActivity = () => {
  const params = { sort: 'activeMembers', order: 'desc', limit: HOME.clans.limit } as const;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.clans.list(params),
    queryFn: ({ signal }) => listClans({ ...params, signal })
  });

  return { rows: data?.items ?? [], isPending, isError, retry: () => void refetch() };
};
