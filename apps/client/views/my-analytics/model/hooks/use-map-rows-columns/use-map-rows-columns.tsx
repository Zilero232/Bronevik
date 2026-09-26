'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { MapClassRowView } from './use-map-rows-columns.types';

import { BreakdownKeyCell } from '../../../ui/components/BreakdownPanel/components';
import { SpawnCell } from '../../../ui/components/MapsTab/components';
import { useStatColumns } from '../use-stat-columns';

const column = createColumnHelper<MapClassRowView>();

export const useMapRowsColumns = (): ColumnDef<MapClassRowView, never>[] => {
  const t = useTranslations('analytics.columns');
  const stats = useStatColumns<MapClassRowView>();

  return [
    column.accessor('mapName', { header: t('map') }),
    column.accessor((row) => row.vehicleClass ?? '', {
      id: 'vehicleClass',
      header: t('byClass'),
      cell: ({ row }) => (row.original.vehicleClass ? <BreakdownKeyCell dimension='byClass' value={row.original.vehicleClass} /> : null)
    }),
    column.accessor((row) => row.team ?? 0, {
      id: 'team',
      header: t('spawn'),
      cell: ({ row }) => <SpawnCell team={row.original.team} />
    }),
    ...stats
  ];
};
