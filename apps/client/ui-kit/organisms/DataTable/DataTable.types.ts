import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type DataTableDensity = 'compact' | 'default' | 'media';

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, never>[];
  initialSorting?: SortingState;
  virtualizeAfter?: number;
  density?: DataTableDensity;
  rowHeight?: number;
  isLoading?: boolean;
  emptyState?: ReactNode;
  caption?: string;
  summary?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;
};
