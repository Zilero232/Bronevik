'use client';

import type { MissionMetric, MissionTank } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell, WinRateCell } from '@/entities/tank/tank';

import { MetricCell } from '../../../ui/components/MissionTanks/components';

const column = createColumnHelper<MissionTank>();

export const useMissionTanksColumns = (metric: MissionMetric): TableColumn<MissionTank>[] => {
  const t = useTranslations('missions');

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tanks.tank'),
      enableSorting: false,
      cell: ({ row }) => <TankCell vehicle={row.original.vehicle} />
    }),
    column.accessor('value', { header: t(`metric.${metric}`), cell: ({ getValue }) => <MetricCell metric={metric} value={getValue()} /> }),
    column.accessor('winRate', {
      header: t('tanks.winRate'),
      cell: ({ getValue }) => <WinRateCell value={getValue()} />,
      meta: { hideBelow: 'sm' }
    }),
    column.accessor('battles', {
      header: t('tanks.battles'),
      cell: ({ getValue }) => <MetricCell value={getValue()} />,
      meta: { hideBelow: 'md' }
    }),
    column.accessor('score', {
      header: t('tanks.score'),
      cell: ({ getValue }) => <MetricCell value={getValue()} />,
      meta: { hideBelow: 'md' }
    })
  ];
};
