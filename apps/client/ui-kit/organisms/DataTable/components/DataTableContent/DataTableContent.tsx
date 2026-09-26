'use client';

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { clsx } from 'clsx';

import { columnMax, useDataTableState } from '@/shared/lib';

import type { DataTableProps } from '../../DataTable.types';

import { DATA_TABLE } from '../../DataTable.constants';
import { DataTableHead } from '../DataTableHead';
import { DataTableRows } from '../DataTableRows';
import { DataTableSkeleton } from '../DataTableSkeleton';
import { DataTableToolbar } from '../DataTableToolbar';
import { DataTableVirtualRows } from '../DataTableVirtualRows';

import s from '../../DataTable.module.scss';

export const DataTableContent = <T,>({
  data,
  columns,
  initialSorting = [],
  virtualizeAfter = DATA_TABLE.virtualizeAfter,
  density = 'default',
  rowHeight = DATA_TABLE.rowHeight[density],
  isLoading = false,
  emptyState,
  caption,
  summary,
  toolbar,
  footer,
  className,
  getRowId,
  onRowClick,
  rowTint,
  getRowClass,
  getRowLink,
  renderCard,
  isMediaFirst = false
}: DataTableProps<T>) => {
  'use no memo';

  const { scrollNode, setScrollNode, sorting, setSorting } = useDataTableState({ initialSorting });

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getRowId,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const { rows } = table.getRowModel();
  const isVirtual = rows.length > virtualizeAfter;
  const hasCards = Boolean(renderCard) && !isLoading && rows.length > 0;
  const columnCount = table.getVisibleLeafColumns().length;
  const barMax = Object.fromEntries(
    table.getVisibleLeafColumns().flatMap((column) => {
      const bar = column.columnDef.meta?.bar;

      return bar ? [[column.id, columnMax({ rows, value: (row) => row.getValue<number | null>(column.id) })]] : [];
    })
  );

  return (
    <div
      className={clsx(s.frame, className)}
      data-cards={hasCards}
      data-density={density}
      data-media-first={isMediaFirst}
      style={{ '--table-row-h': `${rowHeight}px` }}
    >
      {(summary || toolbar) && <DataTableToolbar summary={summary} toolbar={toolbar} />}
      <div ref={setScrollNode} className={s.root} data-virtual={isVirtual}>
        <table className={s.table}>
          {caption && <caption className={s.caption}>{caption}</caption>}
          <DataTableHead table={table} />
          {isLoading && <DataTableSkeleton columnCount={columnCount} />}
          {!isLoading && isVirtual && (
            <DataTableVirtualRows
              barMax={barMax}
              columnCount={columnCount}
              getRowClass={getRowClass}
              getRowLink={getRowLink}
              rowHeight={rowHeight}
              rows={rows}
              rowTint={rowTint}
              scrollElement={() => scrollNode}
              onRowClick={onRowClick}
            />
          )}
          {!isLoading && !isVirtual && (
            <DataTableRows barMax={barMax} getRowClass={getRowClass} getRowLink={getRowLink} rows={rows} rowTint={rowTint} onRowClick={onRowClick} />
          )}
        </table>
        {!isLoading && rows.length === 0 && emptyState}
      </div>
      {hasCards && renderCard && (
        <ul className={s.cards}>
          {rows.map((row) => (
            <li key={row.id} className={s.card}>
              {renderCard(row.original)}
            </li>
          ))}
        </ul>
      )}
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
};
