import type { Row } from '@tanstack/react-table';

import type { DataTableRowTint } from '../../DataTable.types';

export type DataTableRowsProps<T> = {
  rows: Row<T>[];
  onRowClick?: (row: T) => void;
  rowTint?: (row: T) => DataTableRowTint | null;
};
