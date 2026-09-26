'use client';

import { useAuthSession } from '@/entities/auth/session';
import { isUnauthorizedError } from '@/shared/api/source';

export const useAccountShell = () => {
  const { data: session, isPending, error, isFetching, refetch } = useAuthSession();

  return {
    state: {
      isPending,
      isFailed: !session && Boolean(error) && !isUnauthorizedError(error),
      isSignedIn: Boolean(session)
    },
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
