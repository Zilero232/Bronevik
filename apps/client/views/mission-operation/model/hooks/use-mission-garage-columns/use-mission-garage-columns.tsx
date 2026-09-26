'use client';

import type { MissionGarageTank, MissionMetric } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { TankCell, WinRateCell } from '@/entities/tank/tank';

import { MetricCell } from '../../../ui/components/MissionTanks/components/MetricCell';

const column = createColumnHelper<MissionGarageTank>();

export const useMissionGarageColumns = (metric: MissionMetric): ColumnDef<MissionGarageTank, never>[] => {
  const t = useTranslations('missions');

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tanks.tank'),
      enableSorting: false,
      cell: ({ row }) => <TankCell vehicle={row.original.vehicle} />
    }),
    column.accessor('value', { header: t(`metric.${metric}`), cell: ({ getValue }) => <MetricCell metric={metric} value={getValue()} /> }),
    column.accessor('ownBattles', { header: t('tanks.ownBattles'), cell: ({ getValue }) => <MetricCell value={getValue()} /> }),
    column.accessor('ownWinRate', { header: t('tanks.ownWinRate'), cell: ({ getValue }) => <WinRateCell value={getValue()} /> })
  ];
};
