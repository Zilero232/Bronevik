'use client';

import { useVirtualizer } from '@tanstack/react-virtual';

import type { DataTableVirtualRowsProps } from './DataTableVirtualRows.types';

import { DATA_TABLE } from '../../DataTable.constants';
import { DataTableCells } from '../DataTableCells';

import s from '../../DataTable.module.scss';

export const DataTableVirtualRows = <T,>({ rows, scrollElement, rowHeight, columnCount, onRowClick }: DataTableVirtualRowsProps<T>) => {
  'use no memo';

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: scrollElement,
    estimateSize: () => rowHeight,
    overscan: DATA_TABLE.overscan
  });

  const items = virtualizer.getVirtualItems();
  const paddingTop = items[0]?.start ?? 0;
  const paddingBottom = virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0);

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden>
          <td colSpan={columnCount} style={{ height: paddingTop, padding: 0 }} />
        </tr>
      )}
      {items.map((item) => {
        const row = rows[item.index];

        return (
          <tr
            key={row.id}
            className={s.row}
            data-clickable={Boolean(onRowClick)}
            style={{ height: rowHeight }}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          >
            <DataTableCells row={row} />
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
