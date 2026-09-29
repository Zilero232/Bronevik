'use client';

import type { Replay } from '@/entities/replay/replay';

import { useMapNameOf } from '@/entities/map/map';

export const useReplayMapName = () => {
  const nameOf = useMapNameOf();

  return ({ arenaId, mapName }: Pick<Replay, 'arenaId' | 'mapName'>) => nameOf(arenaId) ?? mapName ?? arenaId;
};
