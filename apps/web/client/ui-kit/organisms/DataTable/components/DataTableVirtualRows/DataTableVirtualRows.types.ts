import type { DataTableRowsProps } from '../DataTableRows';

export type DataTableVirtualRowsProps<T> = DataTableRowsProps<T> & {
  scrollElement: () => HTMLDivElement | null;
  rowHeight: number;
  columnCount: number;
};
