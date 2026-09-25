'use client';

import { flexRender } from '@tanstack/react-table';
import { motion } from 'motion/react';

import { ROW_ITEM } from '@/shared/lib';

import type { DataTableCellsProps, DataTableRowsProps } from '../../DataTable.types';

import s from '../../DataTable.module.scss';

export const DataTableCells = <T,>({ row }: DataTableCellsProps<T>) =>
  row.getVisibleCells().map((cell) => (
    <td key={cell.id} className={s.td} data-align={cell.column.columnDef.meta?.align ?? 'start'} data-numeric={cell.column.columnDef.meta?.isNumeric}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  ));

export const DataTableRows = <T,>({ rows, onRowClick }: DataTableRowsProps<T>) => (
  <motion.tbody animate='visible' initial='hidden'>
    {rows.map((row, index) => (
      <motion.tr
        key={row.id}
        className={s.row}
        custom={index}
        data-clickable={Boolean(onRowClick)}
        layout='position'
        variants={ROW_ITEM}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      >
        <DataTableCells row={row} />
      </motion.tr>
    ))}
  </motion.tbody>
);
