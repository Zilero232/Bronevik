'use client';

import { useQuery } from '@tanstack/react-query';

import { getLiveStreamers } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { NAV_MENU } from '../../../config';

export const useLiveStreamers = () => {
  const { data } = useQuery({ queryKey: QUERY_KEYS.streamers.live, queryFn: getLiveStreamers, staleTime: NAV_MENU.liveStaleMs });

  return { count: data?.length ?? 0 };
};
