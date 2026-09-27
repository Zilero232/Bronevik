'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { QUERY_KEYS } from '@/shared/constants';

import { getMapQueue, getMapRotation } from '../../../api';
import { MAP_STATS } from '../../../config';
import { queueHeat } from '../../../lib';
import { useMapStatsFilters } from '../use-map-stats-filters';
import { useWaitFormat } from '../use-wait-format';

export const useMapRotationPanel = () => {
  const t = useTranslations('mapStats');
  const { tier, mode } = useMapStatsFilters();
  const formatWait = useWaitFormat();
  const rotation = useQuery({
    queryKey: QUERY_KEYS.mapStats.rotation({ tier, mode }),
    queryFn: ({ signal }) => getMapRotation({ tier, mode, signal }),
    staleTime: MAP_STATS.staleMs,
    select: (data) => ({ ...data, maxShare: Math.max(0, ...data.rows.map((row) => row.share)) })
  });

  const queue = useQuery({
    queryKey: QUERY_KEYS.mapStats.queue({ tier, mode }),
    queryFn: ({ signal }) => getMapQueue({ tier, mode, signal }),
    staleTime: MAP_STATS.staleMs,
    select: (data) => ({
      ...data,
      heat: queueHeat({ cells: data.cells, minSamples: data.minSamples, hours: MAP_STATS.hours, tones: MAP_STATS.waitTones })
    })
  });

  const { data: rotationData } = rotation;
  const { data: queueData } = queue;
  const selected = queueData?.now.selected ?? null;
  const fastest = queueData?.now.fastest ?? null;

  return {
    rotation,
    queue,
    figures: {
      battles: rotationData?.battles ?? null,
      battlesHint: rotationData ? t('figures.battlesHint', { days: rotationData.windowDays }) : undefined,
      maps: rotationData?.rows.length ?? null,
      waitNow: selected ? formatWait(selected.medianSec) : null,
      waitNowHint: queueData ? t('figures.waitNowHint', { hour: queueData.now.hour, timezone: queueData.timezone }) : undefined,
      fastest: fastest ? t('figures.hour', { hour: fastest.hour }) : null,
      fastestHint: fastest ? t('figures.fastestHint', { wait: formatWait(fastest.medianSec) }) : undefined
    },
    rotationMeta: rotationData ? t('rotation.meta', { days: rotationData.windowDays }) : undefined,
    queueMeta: queueData ? t('queue.meta', { days: queueData.windowDays, timezone: queueData.timezone }) : undefined
  };
};
