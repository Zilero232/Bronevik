import type { Row } from '@tanstack/react-table';

import type { DataTableBarMax, DataTableRowLink, DataTableRowTint } from '../../DataTable.types';

export type DataTableRowsProps<T> = {
  rows: Row<T>[];
  barMax: DataTableBarMax;
  onRowClick?: (row: T) => void;
  rowTint?: (row: T) => DataTableRowTint | null;
  getRowClass?: (row: T) => string | null;
  getRowLink?: (row: T) => DataTableRowLink | null;
};
