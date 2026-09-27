'use client';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';

export const useSessionPage = (nickname: string) => {
  const profile = usePlayerProfile(nickname);

  return {
    data: isNotFoundError(profile.error) ? null : profile.data?.summary,
    isError: profile.isError,
    isRefetching: profile.isRefetching,
    refetch: profile.refetch
  };
};
