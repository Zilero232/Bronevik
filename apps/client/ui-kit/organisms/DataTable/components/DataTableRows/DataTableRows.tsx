import { isInteractiveTarget } from '@/shared/lib';

import type { DataTableRowsProps } from './DataTableRows.types';

import { DataTableCells } from '../DataTableCells';

import s from '../../DataTable.module.scss';

export const DataTableRows = <T,>({ rows, barMax, onRowClick, rowTint, getRowClass, getRowLink }: DataTableRowsProps<T>) => (
  <tbody>
    {rows.map((row) => {
      const link = getRowLink?.(row.original) ?? null;

      return (
        <tr
          key={row.id}
          className={s.row}
          data-class={getRowClass?.(row.original) ?? undefined}
          data-clickable={Boolean(onRowClick) || link !== null}
          data-linked={link !== null}
          data-tint={rowTint?.(row.original) ?? undefined}
          onClick={onRowClick ? (event) => !isInteractiveTarget(event.target) && onRowClick(row.original) : undefined}
        >
          <DataTableCells barMax={barMax} link={link} row={row} />
        </tr>
      );
    })}
  </tbody>
);
