'use client';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

export const useCompleteSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
    router.push(ROUTES.me);
  };
};
