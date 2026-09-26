'use client';

import type { TankServerStatsRow } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell, TierCell, WinRateCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { DeltaValue } from '@/ui-kit';

import { TANKS_TABLE } from '../../../config';

const column = createColumnHelper<TankServerStatsRow>();

export const useTankColumns = (): ColumnDef<TankServerStatsRow, never>[] => {
  const t = useTranslations('tanks.table');
  const format = useFormatter();

  const decimal = (value: number) => format.number(value, { maximumFractionDigits: 2 });

  return [
    column.accessor((row) => row.popularityRank ?? undefined, {
      id: 'rank',
      header: '#',
      sortUndefined: 'last',
      meta: { align: 'end', isRank: true, width: TANKS_TABLE.rankWidth }
    }),
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankCell vehicle={info.row.original.vehicle} />,
      meta: { width: TANKS_TABLE.tankWidth }
    }),
    column.accessor((row) => row.vehicle.tier, {
      id: 'tier',
      header: t('tier'),
      cell: (info) => <TierCell tier={info.getValue()} />,
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'sm' }
    }),
    column.accessor('winRate', { header: t('winRate'), cell: (info) => <WinRateCell value={info.getValue()} />, meta: TANKS_TABLE.numeric }),
    column.accessor('winRateDiff', {
      header: t('winRateDiff'),
      cell: (info) => <DeltaValue isSameShown value={info.getValue()} />,
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'md' }
    }),
    column.accessor('avgDamage', {
      header: t('avgDamage'),
      cell: (info) => format.number(info.getValue(), { maximumFractionDigits: 0 }),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('avgFrags', { header: t('frags'), cell: (info) => decimal(info.getValue()), meta: { ...TANKS_TABLE.numeric, hideBelow: 'lg' } }),
    column.accessor('avgSpotted', {
      header: t('spotted'),
      cell: (info) => decimal(info.getValue()),
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor('survivalRate', {
      header: t('survival'),
      cell: (info) => percentText({ format, value: info.getValue() }),
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'xl' }
    }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { ...TANKS_TABLE.numeric, bar: { tone: 'steel' } }
    })
  ];
};
