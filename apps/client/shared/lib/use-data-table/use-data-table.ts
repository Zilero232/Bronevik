'use client';

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import type { UseDataTableInput } from './use-data-table.types';

import { columnMax } from '../column-max';
import { useDataTableState } from '../use-data-table-state';

export const useDataTable = <T>({ data, columns, getRowId, initialSorting, virtualizeAfter, isLoading, hasCards }: UseDataTableInput<T>) => {
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
  const visibleColumns = table.getVisibleLeafColumns();
  const barMax = Object.fromEntries(
    visibleColumns.flatMap((column) =>
      column.columnDef.meta?.bar ? [[column.id, columnMax({ rows, value: (row) => row.getValue<number | null>(column.id) })]] : []
    )
  );

  return {
    table,
    rows,
    scrollNode,
    setScrollNode,
    barMax,
    columnCount: visibleColumns.length,
    isVirtual: rows.length > virtualizeAfter,
    isEmpty: !isLoading && rows.length === 0,
    hasCards: hasCards && !isLoading && rows.length > 0
  };
};
