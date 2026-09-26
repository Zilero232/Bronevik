'use client';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { ErrorState, Skeleton } from '@/ui-kit';

import type { AnalyticsStateProps } from './AnalyticsState.types';

import { ANALYTICS_VIEW } from '../../../config';
import { NoAccountState } from '../NoAccountState';

export const AnalyticsState = <T,>({
  status,
  data,
  feature = 'analytics',
  isRetrying,
  height = ANALYTICS_VIEW.skeletonHeight,
  onRetry,
  children
}: AnalyticsStateProps<T>) => {
  if (status === 'plus') {
    return <PlusTeaser feature={feature} />;
  }

  if (status === 'noAccount') {
    return <NoAccountState />;
  }

  if (status === 'error') {
    return <ErrorState isCompact isRetrying={isRetrying} onRetry={onRetry} />;
  }

  return data === undefined ? <Skeleton height={height} shape='block' /> : children(data);
};
