import type { ReactNode } from 'react';

import type { EmptyStateProps } from '../EmptyState';

export type FilteredEmptyStateProps = Omit<EmptyStateProps, 'action'> & {
  isFiltered: boolean;
  resetLabel?: ReactNode;
  onReset: () => void;
};
