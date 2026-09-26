'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { getCompetition } from '@/entities/competition/competition';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

export const useCompetition = (slug: string) => {
  const [code] = useQueryState('code', parseAsString);
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.competitions.detail({ slug, ...(code ? { code } : {}) }),
    queryFn: ({ signal }) => getCompetition({ slug, code: code ?? undefined, signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < 2
  });

  return {
    competition: data ?? null,
    isPending,
    isError,
    isNotFound: isNotFoundError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
