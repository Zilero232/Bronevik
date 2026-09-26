'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { startPlusTrial } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

export const useStartTrial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startPlusTrial,
    onSuccess: (status) => queryClient.setQueryData(QUERY_KEYS.me.billing.status, status)
  });
};
