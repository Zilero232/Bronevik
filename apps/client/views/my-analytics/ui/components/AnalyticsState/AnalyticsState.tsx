'use client';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { QueryState, Skeleton } from '@/ui-kit';

import type { AnalyticsStateProps } from './AnalyticsState.types';

import { ANALYTICS_VIEW } from '../../../config';
import { NoAccountState } from '../NoAccountState';

export const AnalyticsState = <T,>({
  state: { data, status, isRetrying, retry },
  feature = 'analytics',
  height = ANALYTICS_VIEW.skeletonHeight,
  empty,
  isEmpty,
  children
}: AnalyticsStateProps<T>) => {
  if (status === 'plus') {
    return <PlusTeaser feature={feature} />;
  }

  if (status === 'noAccount') {
    return <NoAccountState />;
  }

  return (
    <QueryState
      isCompact
      empty={empty}
      isEmpty={isEmpty}
      query={{ data, isError: status === 'error', isRefetching: isRetrying, refetch: retry }}
      skeleton={<Skeleton height={height} shape='block' />}
    >
      {children}
    </QueryState>
  );
};
