'use client';

import { match } from 'ts-pattern';

import { useRecommendedBuild } from '../use-recommended-build';
import { useShowcaseSource } from '../use-showcase-source';

export const useShowcaseStatus = () => {
  const { source } = useShowcaseSource();
  const { isPending, isError, isFetching, refetch } = useRecommendedBuild(source);

  const status = match({ isPending, isError })
    .with({ isPending: true }, () => 'pending' as const)
    .with({ isError: true }, () => 'error' as const)
    .otherwise(() => 'ready' as const);

  const onRetry = () => {
    void refetch();
  };

  return { status, isRetrying: isFetching, onRetry };
};
