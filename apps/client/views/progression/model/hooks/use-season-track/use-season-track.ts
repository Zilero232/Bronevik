'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';
import { useCelebrateGain } from '@/shared/lib';

import { getSeasonTrack } from '../../../api';
import { levelProgress } from '../../../lib/level-progress';

export const useSeasonTrack = () => {
  const {
    data: track,
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.me.progression.season,
    queryFn: getSeasonTrack
  });

  useCelebrateGain({ key: track ? `season:${track.season.code}` : null, value: track?.level });

  return {
    track,
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch(),
    progress: track ? levelProgress({ current: track.points, start: track.levelPoints, next: track.nextLevelPoints }) : null
  };
};
