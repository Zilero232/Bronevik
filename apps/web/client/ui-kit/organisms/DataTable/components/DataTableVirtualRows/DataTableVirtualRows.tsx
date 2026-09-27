'use client';

import { rowActivation, useTableVirtualizer } from '@/shared/lib';

import type { DataTableVirtualRowsProps } from './DataTableVirtualRows.types';

import { DATA_TABLE } from '../../DataTable.constants';
import { DataTableCells } from '../DataTableCells';

import s from '../../DataTable.module.scss';

export const DataTableVirtualRows = <T,>({
  rows,
  barMax,
  scrollElement,
  rowHeight,
  columnCount,
  onRowClick,
  rowTint,
  getRowClass,
  getRowLink
}: DataTableVirtualRowsProps<T>) => {
  'use no memo';

  const { items, paddingTop, paddingBottom } = useTableVirtualizer({
    count: rows.length,
    getScrollElement: scrollElement,
    rowHeight,
    overscan: DATA_TABLE.overscan
  });

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden>
          <td colSpan={columnCount} style={{ height: paddingTop, padding: 0 }} />
        </tr>
      )}
      {items.map((item) => {
        const row = rows[item.index];
        const link = getRowLink?.(row.original) ?? null;

        return (
          <tr
            key={row.id}
            className={s.row}
            data-class={getRowClass?.(row.original) ?? undefined}
            data-clickable={Boolean(onRowClick) || link !== null}
            data-linked={link !== null}
            data-tint={rowTint?.(row.original) ?? undefined}
            style={{ height: rowHeight }}
            {...rowActivation({ onActivate: onRowClick && (() => onRowClick(row.original)), isLinked: link !== null })}
          >
            <DataTableCells barMax={barMax} link={link} row={row} />
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden>
          <td colSpan={columnCount} style={{ height: paddingBottom, padding: 0 }} />
        </tr>
      )}
    </tbody>
  );
};
