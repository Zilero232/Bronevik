import type { Row } from '@tanstack/react-table';

import type { DataTableRowsProps } from '../DataTableRows';

export type DataTableRowProps<T> = Omit<DataTableRowsProps<T>, 'rows'> & {
  row: Row<T>;
  index: number;
  height?: number;
  ariaRowIndex?: number;
};
