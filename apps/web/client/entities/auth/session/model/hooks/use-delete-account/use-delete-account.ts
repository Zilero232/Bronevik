'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { deleteAccount } from '../../../api';
import { useResetUserQueries } from '../use-reset-user-queries';

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const resetUserQueries = useResetUserQueries();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (outcome) => {
      if (outcome !== 'deleted') {
        return;
      }

      queryClient.setQueryData(QUERY_KEYS.auth.session, null);
      resetUserQueries();
    }
  });
};
