'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import type { UseDataTableInput } from './use-data-table.types';

import { columnMax } from '../column-max';
import { dataTableLayout } from '../data-table-layout';
import { pinnedFirst } from '../pinned-first';
import { useDataTableState } from '../use-data-table-state';
import { useHydrated } from '../use-hydrated';
import { DATA_TABLE_LAYOUT } from './use-data-table.constants';

export const useDataTable = <T>({
  data,
  columns,
  getRowId,
  pinnedRowIds,
  initialSorting,
  virtualizeAfter,
  isLoading,
  hasCards
}: UseDataTableInput<T>) => {
  'use no memo';

  const { scrollNode, setScrollNode, sorting, setSorting } = useDataTableState({ initialSorting });
  const isHydrated = useHydrated();
  const isCompact = useMediaQuery(DATA_TABLE_LAYOUT.cardsQuery);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getRowId,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const rows = pinnedFirst({ rows: table.getRowModel().rows, pinnedIds: pinnedRowIds });
  const visibleColumns = table.getVisibleLeafColumns();
  const barMax = Object.fromEntries(
    visibleColumns.flatMap((column) =>
      column.columnDef.meta?.bar ? [[column.id, columnMax({ rows, value: (row) => row.getValue<number | null>(column.id) })]] : []
    )
  );

  const isEmpty = !isLoading && rows.length === 0;
  const { showTable, showCards } = dataTableLayout({ hasCards, isHydrated, isCompact });

  return {
    table,
    rows,
    scrollNode,
    setScrollNode,
    barMax,
    columnCount: visibleColumns.length,
    isVirtual: rows.length > virtualizeAfter,
    isEmpty,
    hasCards,
    showTable,
    showCards
  };
};
