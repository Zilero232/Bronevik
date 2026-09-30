'use client';

import { useStoredStore } from '@/shared/lib';

import { ownPlayerStore } from '../../../lib/own-player-store';

export const useOwnPlayer = () => {
  const state = useStoredStore(ownPlayerStore);

  return { isReady: state !== null, player: state?.player ?? null };
};
