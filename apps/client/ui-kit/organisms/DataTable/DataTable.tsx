'use client';

import type { SortingState } from '@tanstack/react-table';

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { useState } from 'react';

import type { DataTableProps } from './DataTable.types';

import { DataTableHead, DataTableRows, DataTableSkeleton, DataTableVirtualRows } from './components';
import { DATA_TABLE } from './DataTable.constants';

import s from './DataTable.module.scss';

export const DataTable = <T,>({
  data,
  columns,
  initialSorting = [],
  virtualizeAfter = DATA_TABLE.virtualizeAfter,
  rowHeight = DATA_TABLE.rowHeight,
  isLoading = false,
  emptyState,
  caption,
  className,
  getRowId,
  onRowClick
}: DataTableProps<T>) => {
  'use no memo';

  const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

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
    <div ref={setScrollNode} className={clsx(s.root, className)} data-virtual={isVirtual}>
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
  );
};
