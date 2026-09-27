'use client';

import type { MoeRow } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell } from '@/entities/tank/tank';
import { DeltaCell, NumberCell } from '@/ui-kit';

const column = createColumnHelper<MoeRow>();

export const useMarksMovementColumns = (): TableColumn<MoeRow>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      enableSorting: false,
      cell: ({ row }) => <TankCell vehicle={row.original.vehicle} />
    }),
    column.accessor((row) => row.moe?.p95 ?? null, {
      id: 'p95',
      header: t('threeMarks'),
      enableSorting: false,
      cell: ({ getValue }) => <NumberCell value={getValue()} />
    }),
    column.accessor((row) => row.trend.p95Delta30d, {
      id: 'delta',
      header: t('delta30d'),
      enableSorting: false,
      cell: ({ getValue }) => <DeltaCell isLowerBetter value={getValue()} />
    })
  ];
};
