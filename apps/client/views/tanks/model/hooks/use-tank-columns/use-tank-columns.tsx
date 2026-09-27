'use client';

import type { TankServerStatsRow } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell, TierCell, WinRateCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { DeltaValue } from '@/ui-kit';

import type { UseTankColumnsInput } from './use-tank-columns.types';

import { TANKS_TABLE } from '../../../config';

const column = createColumnHelper<TankServerStatsRow>();

export const useTankColumns = ({ hidden }: UseTankColumnsInput): TableColumn<TankServerStatsRow>[] => {
  const t = useTranslations('tanks.table');
  const format = useFormatter();

  const decimal = (value: number) => format.number(value, { maximumFractionDigits: 2 });
  const integer = (value: number) => format.number(value, { maximumFractionDigits: 0 });

  const columns: TableColumn<TankServerStatsRow>[] = [
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
      id: 'winRateDiff',
      header: t('winRateDiff'),
      cell: (info) => <DeltaValue isSameShown value={info.getValue()} />,
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'md' }
    }),
    column.accessor('avgDamage', {
      header: t('avgDamage'),
      cell: (info) => integer(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('avgFrags', {
      id: 'avgFrags',
      header: t('frags'),
      cell: (info) => decimal(info.getValue()),
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor('avgSpotted', {
      id: 'avgSpotted',
      header: t('spotted'),
      cell: (info) => decimal(info.getValue()),
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor('survivalRate', {
      id: 'survivalRate',
      header: t('survival'),
      cell: (info) => percentText({ format, value: info.getValue() }),
      meta: { ...TANKS_TABLE.numeric, hideBelow: 'xl' }
    }),
    column.accessor('players', { id: 'players', header: t('players'), cell: (info) => integer(info.getValue()), meta: TANKS_TABLE.numeric }),
    column.accessor('avgXp', { id: 'avgXp', header: t('avgXp'), cell: (info) => integer(info.getValue()), meta: TANKS_TABLE.numeric }),
    column.accessor('avgBlocked', { id: 'avgBlocked', header: t('avgBlocked'), cell: (info) => integer(info.getValue()), meta: TANKS_TABLE.numeric }),
    column.accessor('accuracy', {
      id: 'accuracy',
      header: t('accuracy'),
      cell: (info) => percentText({ format, value: info.getValue() }),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { ...TANKS_TABLE.numeric, bar: { tone: 'steel' } }
    })
  ];

  return columns.filter(({ id }) => id === undefined || !hidden.includes(id));
};
