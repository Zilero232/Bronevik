import type { Row } from '@tanstack/react-table';

export type DataTableRowsProps<T> = {
  rows: Row<T>[];
  onRowClick?: (row: T) => void;
};
