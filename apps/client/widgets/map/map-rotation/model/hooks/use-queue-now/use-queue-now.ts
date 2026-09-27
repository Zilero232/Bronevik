'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getMapQueue, getMapRotation } from '../../../api';
import { MAP_STATS } from '../../../config';
import { useWaitFormat } from '../use-wait-format';

export const useQueueNow = () => {
  const queue = useQuery({
    queryKey: QUERY_KEYS.mapStats.queue(MAP_STATS.compact),
    queryFn: ({ signal }) => getMapQueue({ ...MAP_STATS.compact, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const rotation = useQuery({
    queryKey: QUERY_KEYS.mapStats.rotation(MAP_STATS.compact),
    queryFn: ({ signal }) => getMapRotation({ ...MAP_STATS.compact, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const formatWait = useWaitFormat();
  const now = queue.data?.now ?? null;
  const overall = now?.selected ?? null;

  return {
    now,
    formatWait,
    timezone: queue.data?.timezone ?? null,
    query: {
      data:
        queue.isPending || (queue.isError && rotation.isError)
          ? undefined
          : {
              overall,
              tiers: (now?.tiers ?? []).map((cell) => ({ ...cell, deltaSec: overall ? cell.medianSec - overall.medianSec : null })),
              topMaps: (rotation.data?.rows ?? []).slice(0, MAP_STATS.compactTopMaps)
            },
      isError: queue.isError && rotation.isError,
      isRefetching: queue.isFetching || rotation.isFetching,
      refetch: () => {
        void queue.refetch();
        void rotation.refetch();
      }
    }
  };
};
