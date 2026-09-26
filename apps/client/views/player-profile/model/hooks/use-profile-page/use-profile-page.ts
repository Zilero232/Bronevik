'use client';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';

import { useRememberPlayer } from '../use-remember-player';

export const useProfilePage = (nickname: string) => {
  const { data: profile, isPending, error, isRefetching, refetch } = usePlayerProfile(nickname);

  useRememberPlayer(profile);

  return {
    profile,
    isPending,
    isNotFound: isNotFoundError(error),
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
