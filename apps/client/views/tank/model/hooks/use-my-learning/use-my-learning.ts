'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyTankLearning } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { bucketLabel } from '../../../lib';
import { useTank } from '../../context';

export const useMyLearning = () => {
  const { tankId, detail } = useTank();
  const query = useQuery({
    queryKey: QUERY_KEYS.tanks.myLearning(tankId),
    queryFn: ({ signal }) => getMyTankLearning({ tankId, signal })
  });

  const bucket = query.data ? detail.learning.buckets[query.data.bucket] : undefined;

  return { ...query, bucketLabel: bucket ? bucketLabel(bucket) : null };
};
