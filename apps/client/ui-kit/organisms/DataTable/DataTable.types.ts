import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type DataTableDensity = 'compact' | 'default' | 'media';

export type DataTableRowTint = 'bad' | 'good' | 'loss' | 'self' | 'win';

export type DataTableRowLink = {
  href: string;
  label: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
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
  rowTint?: (row: T) => DataTableRowTint | null;
  getRowClass?: (row: T) => string | null;
  getRowLink?: (row: T) => DataTableRowLink | null;
  renderCard?: (row: T) => ReactNode;
  isMediaFirst?: boolean;
};

export type DataTableBarMax = Record<string, number>;
