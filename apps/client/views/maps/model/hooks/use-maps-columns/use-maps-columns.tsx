'use client';

import type { MapSummary } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { useMapLabels } from '@/entities/map/map';

import { CamouflageCell, MapNameCell } from '../../../ui/components/MapsTable/components';

const column = createColumnHelper<MapSummary>();

export const useMapsColumns = (): ColumnDef<MapSummary, never>[] => {
  const t = useTranslations('maps');
  const labels = useMapLabels();

  return [
    column.accessor('name', {
      header: t('columns.name'),
      cell: ({ row: { original } }) => <MapNameCell name={original.name} slug={original.slug} />
    }),
    column.accessor((row) => row.camouflage ?? '', {
      id: 'camouflage',
      header: t('columns.camouflage'),
      cell: ({ row: { original } }) => <CamouflageCell camouflage={original.camouflage} />
    }),
    column.accessor((row) => row.sizeMeters ?? 0, {
      id: 'size',
      header: t('columns.size'),
      cell: ({ row: { original } }) => (original.sizeMeters === null ? '—' : t('size', { size: original.sizeMeters })),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.modes.length, {
      id: 'modes',
      header: t('columns.modes'),
      enableSorting: false,
      cell: ({ row: { original } }) => original.modes.map((mode) => labels.mode(mode)).join(' · ')
    })
  ];
};
