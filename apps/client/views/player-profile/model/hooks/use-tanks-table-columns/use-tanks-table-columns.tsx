'use client';

import type { PlayerTankRow } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { TankAwards } from '@/entities/player/stats';
import { TankCell, WinRateCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';

import { RatingValue } from '../../../ui/components/RatingValue';
import { RecentCell } from '../../../ui/components/TanksTable/components';

const column = createColumnHelper<PlayerTankRow>();

export const useTanksTableColumns = (): ColumnDef<PlayerTankRow, never>[] => {
  const t = useTranslations('profile.tanks.columns');
  const format = useFormatter();

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankCell vehicle={info.row.original.vehicle} />,
      meta: { width: '30%', isMedia: true, isSticky: true }
    }),
    column.accessor('battles', { header: t('battles'), cell: (info) => format.number(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor((row) => row.winRate ?? 0, {
      id: 'winRate',
      header: t('winRate'),
      cell: (info) => <WinRateCell value={info.row.original.winRate} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8.value ?? 0, {
      id: 'wn8',
      header: 'WN8',
      cell: (info) => <RatingValue rating={info.row.original.wn8} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.avgDamage ?? 0, {
      id: 'avgDamage',
      header: t('avgDamage'),
      cell: (info) => format.number(info.getValue(), { maximumFractionDigits: 0 }),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => (row.marksOnGun ?? 0) * 10 + row.markOfMastery, {
      id: 'awards',
      header: t('awards'),
      cell: (info) => <TankAwards markOfMastery={info.row.original.markOfMastery} marksOnGun={info.row.original.marksOnGun} />,
      meta: { align: 'center' }
    }),
    column.accessor((row) => row.moePercent ?? -1, {
      id: 'moe',
      header: t('moe'),
      cell: (info) => percentText({ format, value: info.row.original.moePercent }),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.recent?.stats?.battles ?? 0, {
      id: 'recent',
      header: t('recent'),
      cell: (info) => <RecentCell recent={info.row.original.recent} />,
      meta: { align: 'end' }
    })
  ];
};
