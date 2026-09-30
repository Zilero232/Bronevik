'use client';

import { Suspense } from 'react';

import { fallbackRowCount } from '@/shared/lib';

import type { DataTableProps } from './DataTable.types';

import { DataTableContent, DataTableFallback } from './components';
import { DATA_TABLE } from './DataTable.constants';

export const DataTable = <T,>({
  density = 'default',
  rowHeight = DATA_TABLE.rowHeight[density],
  skeletonRows = DATA_TABLE.skeletonRows,
  ...props
}: DataTableProps<T>) => (
  <Suspense
    fallback={
      <DataTableFallback
        rowCount={fallbackRowCount({
          dataLength: props.data.length,
          isLoading: Boolean(props.isLoading),
          skeletonRows,
          virtualizeAfter: props.virtualizeAfter ?? DATA_TABLE.virtualizeAfter
        })}
        className={props.className}
        columnCount={props.columns.length}
        density={density}
        hasCards={Boolean(props.renderCard)}
        hasFooter={Boolean(props.footer)}
        hasToolbar={Boolean(props.summary ?? props.toolbar)}
        rowHeight={rowHeight}
      />
    }
  >
    <DataTableContent {...props} density={density} rowHeight={rowHeight} skeletonRows={skeletonRows} />
  </Suspense>
);
