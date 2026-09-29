import type { Row } from '@tanstack/react-table';

import type { DataTableBarMax, DataTableProps } from '../../DataTable.types';

export type DataTableRowsProps<T> = Pick<DataTableProps<T>, 'getRowClass' | 'getRowLink' | 'onRowClick' | 'rowTint'> & {
  rows: Row<T>[];
  barMax: DataTableBarMax;
};
