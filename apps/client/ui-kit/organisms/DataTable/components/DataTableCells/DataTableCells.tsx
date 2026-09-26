import { flexRender } from '@tanstack/react-table';

import type { DataTableCellsProps } from './DataTableCells.types';

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
