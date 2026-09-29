import { rowActivation } from '@/shared/lib';

import type { DataTableRowProps } from './DataTableRow.types';

import { DataTableCells } from '../DataTableCells';

import s from '../../DataTable.module.scss';

export const DataTableRow = <T,>({
  row,
  index,
  barMax,
  height,
  ariaRowIndex,
  onRowClick,
  rowTint,
  getRowClass,
  getRowLink
}: DataTableRowProps<T>) => {
  'use no memo';

  const link = getRowLink?.(row.original) ?? null;

  return (
    <tr
      aria-rowindex={ariaRowIndex}
      className={s.row}
      data-class={getRowClass?.(row.original) ?? undefined}
      data-clickable={Boolean(onRowClick) || link !== null}
      data-linked={link !== null}
      data-stripe={index % 2 === 1 || undefined}
      data-tint={rowTint?.(row.original) ?? undefined}
      style={{ height }}
      {...rowActivation({ onActivate: onRowClick && (() => onRowClick(row.original)), isLinked: link !== null })}
    >
      <DataTableCells barMax={barMax} link={link} row={row} />
    </tr>
  );
};
