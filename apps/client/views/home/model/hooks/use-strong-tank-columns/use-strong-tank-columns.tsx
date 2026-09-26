'use client';

import type { TankServerStatsRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { TankCell, WinRateCell } from '@/entities/tank/tank';

import { DeltaCell } from '../../../ui/components/DeltaCell';
import { NumberCell } from '../../../ui/components/NumberCell';

const column = createColumnHelper<TankServerStatsRow>();

export const useStrongTankColumns = (): ColumnDef<TankServerStatsRow, never>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      enableSorting: false,
      cell: ({ row }) => <TankCell vehicle={row.original.vehicle} />
    }),
    column.accessor('winRate', { header: t('winRate'), enableSorting: false, cell: ({ getValue }) => <WinRateCell value={getValue()} /> }),
    column.accessor('winRateDiff', {
      header: t('winRateDiff'),
      enableSorting: false,
      cell: ({ getValue }) => <DeltaCell suffix='%' value={getValue()} />
    }),
    column.accessor('battles', { header: t('battles'), enableSorting: false, cell: ({ getValue }) => <NumberCell value={getValue()} /> })
  ];
};
