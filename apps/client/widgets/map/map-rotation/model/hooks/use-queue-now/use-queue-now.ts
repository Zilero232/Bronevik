'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getMapQueue, getMapRotation } from '../../../api';
import { MAP_STATS } from '../../../config';
import { useWaitFormat } from '../use-wait-format';

export const useQueueNow = () => {
  const {
    data: queue,
    isPending: isQueuePending,
    isError: isQueueError,
    isFetching: isQueueFetching,
    refetch: refetchQueue
  } = useQuery({
    queryKey: QUERY_KEYS.mapStats.queue(MAP_STATS.compact),
    queryFn: ({ signal }) => getMapQueue({ ...MAP_STATS.compact, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const {
    data: rotation,
    isError: isRotationError,
    isFetching: isRotationFetching,
    refetch: refetchRotation
  } = useQuery({
    queryKey: QUERY_KEYS.mapStats.rotation(MAP_STATS.compact),
    queryFn: ({ signal }) => getMapRotation({ ...MAP_STATS.compact, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const formatWait = useWaitFormat();
  const now = queue?.now ?? null;
  const overall = now?.selected ?? null;
  const isError = isQueueError && isRotationError;

  return {
    now,
    formatWait,
    timezone: queue?.timezone ?? null,
    query: {
      data:
        isQueuePending || isError
          ? undefined
          : {
              overall,
              tiers: (now?.tiers ?? []).map((cell) => ({ ...cell, deltaSec: overall ? cell.medianSec - overall.medianSec : null })),
              topMaps: (rotation?.rows ?? []).slice(0, MAP_STATS.compactTopMaps)
            },
      isError,
      isRefetching: isQueueFetching || isRotationFetching,
      refetch: () => {
        void refetchQueue();
        void refetchRotation();
      }
    }
  };
};
