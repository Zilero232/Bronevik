'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getMyGuides } from '@/shared/api/guides';
import { QUERY_KEYS } from '@/shared/constants';

export const useMyGuides = () => {
  const { data: session } = useAuthSession();
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.mine,
    queryFn: ({ signal }) => getMyGuides(signal),
    enabled: Boolean(session)
  });

  return {
    isSignedIn: Boolean(session),
    guides: data ?? [],
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
