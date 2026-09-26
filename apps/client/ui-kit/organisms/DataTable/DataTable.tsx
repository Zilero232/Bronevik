'use client';

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { clsx } from 'clsx';

import { useDataTableState } from '@/shared/lib';

import type { DataTableProps } from './DataTable.types';

import { DataTableHead, DataTableRows, DataTableSkeleton, DataTableToolbar, DataTableVirtualRows } from './components';
import { DATA_TABLE } from './DataTable.constants';

import s from './DataTable.module.scss';

export const DataTable = <T,>({
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
  onRowClick
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
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <div className={clsx(s.frame, className)} data-density={density} style={{ '--table-row-h': `${rowHeight}px` }}>
      {(summary || toolbar) && <DataTableToolbar summary={summary} toolbar={toolbar} />}
      <div ref={setScrollNode} className={s.root} data-virtual={isVirtual}>
        <table className={s.table}>
          {caption && <caption className={s.caption}>{caption}</caption>}
          <DataTableHead table={table} />
          {isLoading && <DataTableSkeleton columnCount={columnCount} />}
          {!isLoading && isVirtual && (
            <DataTableVirtualRows
              columnCount={columnCount}
              rowHeight={rowHeight}
              rows={rows}
              scrollElement={() => scrollNode}
              onRowClick={onRowClick}
            />
          )}
          {!isLoading && !isVirtual && <DataTableRows rows={rows} onRowClick={onRowClick} />}
        </table>
        {!isLoading && rows.length === 0 && emptyState}
      </div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
};
