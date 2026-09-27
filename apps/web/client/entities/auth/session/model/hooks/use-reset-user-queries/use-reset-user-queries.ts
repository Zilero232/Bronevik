'use client';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

export const useResetUserQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    QUERY_KEYS.userScoped.forEach((queryKey) => queryClient.removeQueries({ queryKey }));
  };
};
