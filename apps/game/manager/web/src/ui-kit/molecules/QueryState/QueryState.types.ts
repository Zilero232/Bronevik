import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export type QueryStateProps<Data> = {
  query: Pick<UseQueryResult<Data>, 'data' | 'error' | 'isPending' | 'refetch'>;
  loadingLabel: string;
  errorTitle: string;
  errorMessage?: (error: unknown) => string;
  retryLabel: string;
  children: (data: Data) => ReactNode;
};
