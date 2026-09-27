'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';
import { useCelebrateGain } from '@/shared/lib';

import { getSeasonTrack } from '../../../api';
import { levelProgress } from '../../../lib/level-progress';

export const useSeasonTrack = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.me.progression.season,
    queryFn: getSeasonTrack,
    select: (track) => ({ track, progress: levelProgress({ current: track.points, start: track.levelPoints, next: track.nextLevelPoints }) })
  });

  const track = query.data?.track;

  useCelebrateGain({ key: track ? `season:${track.season.code}` : null, value: track?.level });

  return query;
};
