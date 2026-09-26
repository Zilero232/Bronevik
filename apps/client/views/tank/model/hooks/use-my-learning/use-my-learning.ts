'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyTankLearning } from '@/entities/tank/tank';
import { isNotFoundError } from '@/shared/api/source';
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

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError && !isNotFoundError(query.error),
    isRetrying: query.isFetching,
    onRetry: () => void query.refetch(),
    bucketLabel: bucket ? bucketLabel(bucket) : null
  };
};
