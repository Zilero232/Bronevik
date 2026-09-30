'use client';

import type { ReactNode } from 'react';

import { useReservedHeight } from '@/shared/lib';

import type { QueryStateProps } from './QueryState.types';

import { Skeleton } from '../../atoms';
import { ErrorState } from '../../molecules';
import { QUERY_STATE } from './QueryState.constants';

import s from './QueryState.module.scss';

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
  const { reservedHeight, measureRef } = useReservedHeight();

  const reserve = (node: ReactNode) =>
    reservedHeight === null || node === null || node === undefined || node === false ? (
      node
    ) : (
      <div className={s.reserved} style={{ minHeight: reservedHeight }}>
        {node}
      </div>
    );

  if (data !== undefined) {
    if (isEmpty(data)) {
      return reserve(empty);
    }

    return typeof children === 'function' ? children(data) : children;
  }

  if (isError) {
    return reserve(
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

  return (
    <div aria-busy ref={measureRef} className={s.busy}>
      {skeleton}
    </div>
  );
};
