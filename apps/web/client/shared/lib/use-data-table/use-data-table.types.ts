import type { SortingState, TableOptions } from '@tanstack/react-table';

export type UseDataTableInput<T> = Pick<TableOptions<T>, 'columns' | 'data' | 'getRowId'> & {
  initialSorting: SortingState;
  virtualizeAfter: number;
  isLoading: boolean;
  hasCards: boolean;
  pinnedRowIds?: readonly string[];
};
