'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { getTournament } from '@/entities/tournament/tournament';
import { QUERY_KEYS } from '@/shared/constants';

export const useTournament = (slug: string) => {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tournaments.detail(slug),
    queryFn: ({ signal }) => getTournament({ slug, signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < 2
  });

  return {
    tournament: data ?? null,
    isPending,
    isError,
    isNotFound: isNotFoundError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
