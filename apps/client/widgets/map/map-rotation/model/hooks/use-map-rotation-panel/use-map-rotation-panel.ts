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
    staleTime: MAP_STATS.staleMs,
    select: (data) => ({ ...data, maxShare: Math.max(0, ...data.rows.map((row) => row.share)) })
  });

  const queue = useQuery({
    queryKey: QUERY_KEYS.mapStats.queue(params),
    queryFn: ({ signal }) => getMapQueue({ ...params, signal }),
    staleTime: MAP_STATS.staleMs,
    select: (data) => ({
      ...data,
      heat: queueHeat({ cells: data.cells, minSamples: data.minSamples, hours: MAP_STATS.hours, tones: MAP_STATS.waitTones })
    })
  });

  const formatWait = useWaitFormat();

  return {
    filters,
    formatWait,
    rotation,
    queue
  };
};
