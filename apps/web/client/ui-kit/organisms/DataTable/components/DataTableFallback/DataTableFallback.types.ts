import type { DataTableDensity } from '../../DataTable.types';

export type DataTableFallbackProps = {
  columnCount: number;
  density: DataTableDensity;
  rowHeight: number;
  rowCount: number;
  hasToolbar: boolean;
  hasCards: boolean;
  hasFooter: boolean;
  className?: string;
};
