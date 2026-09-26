import type { DataTableDensity } from '../../DataTable.types';

export type DataTableFallbackProps = {
  columnCount: number;
  density: DataTableDensity;
  rowHeight: number;
  className?: string;
};
