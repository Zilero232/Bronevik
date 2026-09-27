import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import type { ErrorStateProps } from '../../molecules';

export type QueryStateSource<TData> = Pick<QueryObserverBaseResult<TData>, 'isError'> &
  Partial<Pick<QueryObserverBaseResult<TData>, 'isRefetching'>> & {
    data: TData | undefined;
    refetch: () => unknown;
  };

export type QueryStateProps<TData> = Pick<ErrorStateProps, 'isCompact'> & {
  query: QueryStateSource<TData>;
  children: ((data: TData) => ReactNode) | ReactNode;
  skeleton?: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: TData) => boolean;
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  errorState?: ReactNode;
};
