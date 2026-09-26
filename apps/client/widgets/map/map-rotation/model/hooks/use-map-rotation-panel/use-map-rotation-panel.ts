'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getMapQueue, getMapRotation } from '../../../api';
import { MAP_STATS } from '../../../config';
import { queueHeat } from '../../../lib';
import { useMapStatsFilters } from '../use-map-stats-filters';
import { useWaitFormat } from '../use-wait-format';

export const useMapRotationPanel = () => {
  const filters = useMapStatsFilters();
  const params = { tier: filters.tier, mode: filters.mode };
  const rotation = useQuery({
    queryKey: QUERY_KEYS.mapStats.rotation(params),
    queryFn: ({ signal }) => getMapRotation({ ...params, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const queue = useQuery({
    queryKey: QUERY_KEYS.mapStats.queue(params),
    queryFn: ({ signal }) => getMapQueue({ ...params, signal }),
    staleTime: MAP_STATS.staleMs
  });

  const formatWait = useWaitFormat();
  const rows = rotation.data?.rows ?? [];

  return {
    filters,
    formatWait,
    rotation: {
      data: rotation.data ?? null,
      rows,
      maxShare: Math.max(0, ...rows.map((row) => row.share)),
      isPending: rotation.isPending,
      isError: rotation.isError,
      isRetrying: rotation.isFetching,
      retry: () => void rotation.refetch()
    },
    queue: {
      data: queue.data ?? null,
      now: queue.data?.now ?? null,
      heat: queueHeat({
        cells: queue.data?.cells ?? [],
        minSamples: queue.data?.minSamples ?? 0,
        hours: MAP_STATS.hours,
        tones: MAP_STATS.waitTones
      }),
      isPending: queue.isPending,
      isError: queue.isError,
      isRetrying: queue.isFetching,
      retry: () => void queue.refetch()
    }
  };
};
