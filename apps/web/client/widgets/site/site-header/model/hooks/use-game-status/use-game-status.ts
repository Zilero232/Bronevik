'use client';

import { useQuery } from '@tanstack/react-query';

import { gameStatusQueries } from '@/entities/reference/game-status';

import type { GameStatus } from './use-game-status.types';

import { GAME_STATUS } from '../../../config';

export const useGameStatus = (): GameStatus => {
  const { data: version } = useQuery({ ...gameStatusQueries.version(), staleTime: GAME_STATUS.versionStaleMs });
  const { data: servers, isError } = useQuery({
    ...gameStatusQueries.servers(),
    staleTime: GAME_STATUS.serversStaleMs,
    refetchInterval: GAME_STATUS.serversRefetchMs
  });

  const status = isError ? 'down' : servers?.fetchedAt ? 'ok' : 'unknown';

  return { version: version?.version ?? null, status };
};
