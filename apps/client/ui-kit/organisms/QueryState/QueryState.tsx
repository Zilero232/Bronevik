'use client';

import type { QueryStateProps } from './QueryState.types';

import { Skeleton } from '../../atoms';
import { ErrorState } from '../../molecules';
import { QUERY_STATE } from './QueryState.constants';

export const QueryState = <TData,>({
  query: { data, isError, isRefetching = false, refetch },
  children,
  skeleton = <Skeleton height={QUERY_STATE.skeletonHeight} shape='block' />,
  empty = null,
  isEmpty = (value) => Array.isArray(value) && value.length === 0,
  isCompact,
  errorTitle,
  errorDescription,
  errorState
}: QueryStateProps<TData>) => {
  if (data !== undefined) {
    if (isEmpty(data)) {
      return empty;
    }

    return typeof children === 'function' ? children(data) : children;
  }

  if (isError) {
    return (
      errorState ?? (
        <ErrorState
          description={errorDescription}
          isCompact={isCompact}
          isRetrying={isRefetching}
          title={errorTitle}
          onRetry={() => void refetch()}
        />
      )
    );
  }

  return skeleton;
};
