import type { ColumnDef, Row, SortingState, Table } from '@tanstack/react-table';
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

export type DataTableHeadProps<T> = {
  table: Table<T>;
};

export type DataTableCellsProps<T> = {
  row: Row<T>;
};

export type DataTableSkeletonProps = {
  columnCount: number;
};

export type DataTableToolbarProps = {
  summary?: ReactNode;
  toolbar?: ReactNode;
};

export type DataTableRowsProps<T> = {
  rows: Row<T>[];
  onRowClick?: (row: T) => void;
};

export type DataTableVirtualRowsProps<T> = DataTableRowsProps<T> & {
  scrollElement: () => HTMLDivElement | null;
  rowHeight: number;
  columnCount: number;
};
