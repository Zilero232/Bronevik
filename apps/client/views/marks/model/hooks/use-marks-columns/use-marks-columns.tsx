'use client';

import type { MoeRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { MOE_THRESHOLD_KEYS, NUMERIC_COLUMN } from '../../../config';
import { DeltaCell, DetailsCell, DetailsHeaderCell, TankLinkCell, ThresholdCell, TierCell } from '../../../ui/components/MarksTable/components';

const column = createColumnHelper<MoeRow>();

export const useMarksColumns = (): ColumnDef<MoeRow, never>[] => {
  const t = useTranslations('marks.table.columns');

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: ({ row }) => <TankLinkCell vehicle={row.original.vehicle} />,
      meta: { width: '34%' }
    }),
    column.accessor((row) => row.vehicle.tier, {
      id: 'tier',
      header: t('tier'),
      cell: ({ row }) => <TierCell tier={row.original.vehicle.tier} />,
      meta: { align: 'center' }
    }),
    ...MOE_THRESHOLD_KEYS.map((key) =>
      column.accessor((row) => row.moe?.[key] ?? 0, {
        id: key,
        header: t(`thresholds.${key}`),
        cell: ({ row }) => <ThresholdCell isKey={key === 'p95'} value={row.original.moe?.[key] ?? null} />,
        meta: NUMERIC_COLUMN
      })
    ),
    column.accessor((row) => row.trend.p95Delta30d ?? 0, {
      id: 'delta',
      header: t('delta'),
      cell: ({ row }) => <DeltaCell delta={row.original.trend.p95Delta30d} />,
      meta: NUMERIC_COLUMN
    }),
    column.display({
      id: 'details',
      header: () => <DetailsHeaderCell />,
      cell: ({ row }) => <DetailsCell tank={row.original.vehicle.name} />,
      meta: { align: 'end' }
    })
  ];
};
