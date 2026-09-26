'use client';

import { useQuery } from '@tanstack/react-query';

import { listPopularBuilds } from '@/shared/api/builds';
import { QUERY_KEYS } from '@/shared/constants';

import { useTank } from '../../context';

export const usePopularBuilds = () => {
  const { tankId } = useTank();

  return useQuery({
    queryKey: QUERY_KEYS.builds.popular(tankId),
    queryFn: ({ signal }) => listPopularBuilds({ tankId, signal })
  });
};
