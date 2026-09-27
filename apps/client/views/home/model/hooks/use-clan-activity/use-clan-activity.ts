'use client';

import { useQuery } from '@tanstack/react-query';

import { listClans } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useClanActivity = () => {
  const params = { sort: 'activeMembers', order: 'desc', limit: HOME.clans.limit } as const;

  return useQuery({
    queryKey: QUERY_KEYS.clans.list(params),
    queryFn: ({ signal }) => listClans({ ...params, signal }),
    select: ({ items }) => items
  });
};
