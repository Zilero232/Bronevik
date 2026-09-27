'use client';

import { DataTable } from '@/ui-kit';

import type { CompareTableProps } from './CompareTable.types';

import { useCompareTable } from '../../../model/hooks';
import { MetricCard } from './components';

export const CompareTable = ({ comparison, period, isLoading }: CompareTableProps) => {
  const { columns, rows, players } = useCompareTable({ comparison, period });

  return (
    <DataTable
      columns={columns}
      data={rows}
      density='compact'
      getRowId={(row) => row.key}
      isLoading={isLoading}
      renderCard={(row) => <MetricCard players={players} row={row} />}
    />
  );
};
