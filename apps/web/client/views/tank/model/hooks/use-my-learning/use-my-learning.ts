'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyTankLearning } from '@/entities/tank/tank';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { bucketLabel } from '../../../lib';
import { useTank } from '../../context';

export const useMyLearning = () => {
  const { tankId, detail } = useTank();
  const { data, error, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.myLearning(tankId),
    queryFn: ({ signal }) => getMyTankLearning({ tankId, signal })
  });

  const bucket = data ? detail.learning.buckets[data.bucket] : undefined;

  return {
    query: {
      data: isNotFoundError(error) ? null : data,
      isError,
      isRefetching: isFetching,
      refetch
    },
    bucketLabel: bucket ? bucketLabel(bucket) : null
  };
};
