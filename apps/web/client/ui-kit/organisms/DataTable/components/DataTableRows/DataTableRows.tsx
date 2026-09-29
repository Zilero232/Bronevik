import type { DataTableRowsProps } from './DataTableRows.types';

import { DataTableRow } from '../DataTableRow';

export const DataTableRows = <T,>({ rows, ...rowProps }: DataTableRowsProps<T>) => (
  <tbody>
    {rows.map((row, index) => (
      <DataTableRow key={row.id} {...rowProps} index={index} row={row} />
    ))}
  </tbody>
);
