'use client';

import { useQuery } from '@tanstack/react-query';

import { referenceControllerServersOptions, referenceControllerVersionOptions } from '@/shared/api/query-options';

import type { GameStatus } from './use-game-status.types';

import { GAME_STATUS } from '../../../config';

export const useGameStatus = (): GameStatus => {
  const { data: version } = useQuery({ ...referenceControllerVersionOptions(), staleTime: GAME_STATUS.versionStaleMs });
  const { data: servers, isError } = useQuery({
    ...referenceControllerServersOptions(),
    staleTime: GAME_STATUS.serversStaleMs,
    refetchInterval: GAME_STATUS.serversRefetchMs
  });

  const status = isError ? 'down' : servers?.fetchedAt ? 'ok' : 'unknown';

  return { version: version?.version ?? null, status };
};
