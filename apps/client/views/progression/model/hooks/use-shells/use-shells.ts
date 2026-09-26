'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getShells } from '../../../api';
import { PROGRESS_PAGE } from '../../../config';

export const useShells = () => {
  const { data: shells, isPending, isError, isFetching, refetch } = useQuery({ queryKey: QUERY_KEYS.me.progression.shells, queryFn: getShells });

  return {
    shells,
    entries: (shells?.entries ?? []).slice(0, PROGRESS_PAGE.shellEntriesShown),
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
