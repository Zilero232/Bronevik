import type { Row } from '@tanstack/react-table';

import type { DataTableBarMax, DataTableRowLink } from '../../DataTable.types';

export type DataTableCellsProps<T> = {
  row: Row<T>;
  barMax: DataTableBarMax;
  link?: DataTableRowLink | null;
};
