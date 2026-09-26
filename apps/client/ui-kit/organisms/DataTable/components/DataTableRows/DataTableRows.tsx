import type { DataTableRowsProps } from './DataTableRows.types';

import { DataTableCells } from '../DataTableCells';

import s from '../../DataTable.module.scss';

export const DataTableRows = <T,>({ rows, onRowClick, rowTint }: DataTableRowsProps<T>) => (
  <tbody>
    {rows.map((row) => (
      <tr
        key={row.id}
        className={s.row}
        data-clickable={Boolean(onRowClick)}
        data-tint={rowTint?.(row.original) ?? undefined}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      >
        <DataTableCells row={row} />
      </tr>
    ))}
  </tbody>
);
