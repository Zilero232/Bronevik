'use client';

import { useQuery } from '@tanstack/react-query';

import { pulseQueries } from '@/entities/pulse/pulse';
import { gameStatusQueries } from '@/entities/reference/game-status';

import { HOME } from '../../../config';
import { serverFiguresState } from '../../../lib/server-figures';

export const useServerStatus = () => {
  const { data: version } = useQuery({ ...gameStatusQueries.version(), staleTime: HOME.staleMs });
  const { data: servers } = useQuery({ ...gameStatusQueries.servers(), staleTime: HOME.staleMs });
  const { data: pulse, isPending, isError, isRefetching, refetch } = useQuery(pulseQueries.current());

  const activity = pulse?.series.map((point) => point.players) ?? [];
  const trackedPlayers = pulse?.trackedPlayers ?? null;
  const online = servers?.online ?? null;
  const state = serverFiguresState({ isPending, isError, trackedPlayers, online });
  const versionName = version?.version ?? null;

  return {
    state,
    version: versionName,
    isVersionShown: state !== 'error' && (state !== 'empty' || versionName !== null),
    releasedAt: version?.releasedAt ?? null,
    online,
    activePlayers: pulse?.activePlayers ?? null,
    trackedPlayers,
    updatedAt: pulse?.computedAt ?? null,
    activity: activity.length > 1 ? activity : [],
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
