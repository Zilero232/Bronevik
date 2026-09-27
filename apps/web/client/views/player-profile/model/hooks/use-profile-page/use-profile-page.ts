'use client';

import { usePlayerProfile } from '@/entities/player/profile';

import { useRememberPlayer } from '../use-remember-player';

export const useProfilePage = (nickname: string) => {
  const query = usePlayerProfile(nickname);

  useRememberPlayer(query.data);

  return query;
};
