'use client';

import { useQuery } from '@tanstack/react-query';

import { getMoeHistory } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { useTank } from '../context';

export const useMoeHistory = () => {
  const { tankId } = useTank();

  return useQuery({
    queryKey: QUERY_KEYS.marks.history(tankId),
    queryFn: ({ signal }) => getMoeHistory({ tankId, signal })
  });
};
