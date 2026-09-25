'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAuthSession, signOut } from '@/shared/api/auth';
import { QUERY_KEYS } from '@/shared/constants';

export const useAuthSession = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: getAuthSession,
    staleTime: 5 * 60_000,
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
