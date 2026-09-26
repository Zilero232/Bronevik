import { flexRender } from '@tanstack/react-table';

import type { DataTableCellsProps, DataTableRowsProps } from '../../DataTable.types';

import s from '../../DataTable.module.scss';

export const DataTableCells = <T,>({ row }: DataTableCellsProps<T>) =>
  row.getVisibleCells().map((cell) => {
    const { align = 'start', isNumeric, isMedia, isSticky } = cell.column.columnDef.meta ?? {};

    return (
      <td key={cell.id} className={s.td} data-align={align} data-media={isMedia} data-numeric={isNumeric} data-sticky={isSticky}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
  });

export const DataTableRows = <T,>({ rows, onRowClick }: DataTableRowsProps<T>) => (
  <tbody>
    {rows.map((row) => (
      <tr key={row.id} className={s.row} data-clickable={Boolean(onRowClick)} onClick={onRowClick ? () => onRowClick(row.original) : undefined}>
        <DataTableCells row={row} />
      </tr>
    ))}
  </tbody>
);
