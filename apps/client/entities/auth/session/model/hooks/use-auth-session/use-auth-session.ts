'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';
import { useHydrated } from '@/shared/lib';

import type { AuthSessionQuery } from './use-auth-session.types';

import { getAuthSession, signOut } from '../../../api';
import { AUTH_SESSION } from '../../../config';
import { useResetUserQueries } from '../use-reset-user-queries';

export const useAuthSession = (): AuthSessionQuery => {
  const isHydrated = useHydrated();
  const query = useQuery({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: getAuthSession,
    staleTime: AUTH_SESSION.staleMs,
    retry: false
  });

  return {
    data: isHydrated ? query.data : undefined,
    error: isHydrated ? query.error : null,
    isPending: !isHydrated || query.isPending,
    isFetching: isHydrated && query.isFetching,
    refetch: query.refetch
  };
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const resetUserQueries = useResetUserQueries();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.auth.session, null);
      resetUserQueries();
    }
  });
};
