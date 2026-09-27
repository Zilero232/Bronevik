'use client';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';

export const usePlayerSlot = (accountId: number) => {
  const { data: profile, isError, error, isRefetching, refetch } = usePlayerProfile(String(accountId));

  return {
    summary: profile?.summary,
    isError,
    canRetry: isError && !isNotFoundError(error),
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
