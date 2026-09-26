'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAuthSession, signOut } from '@/shared/api/auth';
import { QUERY_KEYS } from '@/shared/constants';

import { AUTH_SESSION } from '../../../config';

export const useAuthSession = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: getAuthSession,
    staleTime: AUTH_SESSION.staleMs,
    retry: false
  });

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.auth.session, null);
      queryClient.removeQueries({ queryKey: QUERY_KEYS.me.all });
    }
  });
};
