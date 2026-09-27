'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useResetUserQueries, useReturnPath } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

export const useCompleteSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetUserQueries = useResetUserQueries();
  const returnPath = useReturnPath();

  return async () => {
    resetUserQueries();
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
    router.push(returnPath);
  };
};
