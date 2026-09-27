'use client';

import { useQuery } from '@tanstack/react-query';

import { getPulse } from '@/entities/pulse/pulse';
import { gameStatusQueries } from '@/entities/reference/game-status';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useServerStatus = () => {
  const { data: version } = useQuery({ ...gameStatusQueries.version(), staleTime: HOME.staleMs });
  const { data: servers } = useQuery({ ...gameStatusQueries.servers(), staleTime: HOME.staleMs });
  const { data: pulse, isPending, isError, refetch } = useQuery({ queryKey: QUERY_KEYS.pulse, queryFn: ({ signal }) => getPulse({ signal }) });

  const activity = pulse?.series.map((point) => point.players) ?? [];

  return {
    version: version?.version ?? null,
    releasedAt: version?.releasedAt ?? null,
    online: servers?.online ?? null,
    activePlayers: pulse?.activePlayers ?? null,
    trackedPlayers: pulse?.trackedPlayers ?? null,
    updatedAt: pulse?.computedAt ?? null,
    activity: activity.length > 1 ? activity : [],
    isPending,
    isError,
    retry: () => void refetch()
  };
};
