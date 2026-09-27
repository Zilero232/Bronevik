'use client';

import type { SortingState } from '@tanstack/react-table';

import { useState } from 'react';

import type { UseDataTableStateInput } from './use-data-table-state.types';

export const useDataTableState = ({ initialSorting }: UseDataTableStateInput) => {
  const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  return { scrollNode, setScrollNode, sorting, setSorting };
};
