'use client';

import { useQuery } from '@tanstack/react-query';

import { getMoeHistory } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

export const useLatestMoe = (tankId: number | null) => {
  const { data: threshold = null, isFetching } = useQuery({
    queryKey: QUERY_KEYS.marks.history(tankId ?? 0),
    queryFn: ({ signal }) => getMoeHistory({ tankId: tankId ?? 0, signal }),
    enabled: tankId !== null,
    select: (history) => history.at(-1) ?? null
  });

  return { threshold, isFetching };
};
