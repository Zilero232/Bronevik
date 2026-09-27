'use client';

import { PLAYLIST } from '@otmetki/schemas';
import { useState } from 'react';

import { getPlaylist } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

import type { AnalyticsStatus } from '../../../lib/analytics-status';

import { ANALYTICS_VIEW } from '../../../config';
import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';

export const usePlaylist = () => {
  const { account } = useAnalyticsFilters();
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const { data, status, isPlus, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.playlist({ account, seed }),
    queryFn: ({ signal }) => getPlaylist({ account, seed, signal }),
    requiresPlus: false
  });

  const resolved: AnalyticsStatus = data?.state === 'noLink' ? 'noAccount' : status;

  return {
    items: data?.items ?? [],
    status: resolved,
    isNoGarage: data?.state === 'noGarage',
    isExtended: data?.isExtended ?? isPlus,
    plusSize: PLAYLIST.plusSize,
    isShuffling: isRetrying,
    retry,
    shuffle: () => setSeed(Math.floor(Math.random() * ANALYTICS_VIEW.seedMax))
  };
};
