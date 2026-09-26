'use client';

import { useQuery } from '@tanstack/react-query';

import { getGuideAuthors } from '@/entities/guide/guide';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_LIST } from '../../../config';

export const useTopAuthors = () => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.authors,
    queryFn: ({ signal }) => getGuideAuthors(signal)
  });

  return {
    authors: (data ?? []).slice(0, GUIDE_LIST.authorsShown),
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
