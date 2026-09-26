'use client';

import { Suspense } from 'react';

import type { DataTableProps } from './DataTable.types';

import { DataTableContent, DataTableFallback } from './components';
import { DATA_TABLE } from './DataTable.constants';

export const DataTable = <T,>({ density = 'default', rowHeight = DATA_TABLE.rowHeight[density], ...props }: DataTableProps<T>) => (
  <Suspense fallback={<DataTableFallback className={props.className} columnCount={props.columns.length} density={density} rowHeight={rowHeight} />}>
    <DataTableContent {...props} density={density} rowHeight={rowHeight} />
  </Suspense>
);
