'use client';

import type { ModeTank } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { ModeRankBadge } from '@/entities/mode/mode';
import { TankCell, WinRateCell } from '@/entities/tank/tank';
import { PERCENT_TEXT, percentText } from '@/shared/lib';

import type { ModeAmountInput } from './use-mode-columns.types';

import { MODE_TABLE } from '../../../config';

const column = createColumnHelper<ModeTank>();

export const useModeColumns = (): TableColumn<ModeTank>[] => {
  const t = useTranslations('modes.table');
  const format = useFormatter();

  const amount = ({ value, digits = 0 }: ModeAmountInput) =>
    value === null ? PERCENT_TEXT.empty : format.number(value, { maximumFractionDigits: digits });

  return [
    column.accessor((row) => row.score ?? undefined, {
      id: 'score',
      header: t('rank'),
      cell: (info) => <ModeRankBadge rank={info.row.original.rank} />,
      sortUndefined: 'last',
      meta: { width: MODE_TABLE.rankWidth }
    }),
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankCell vehicle={info.row.original.vehicle} />,
      meta: { width: MODE_TABLE.tankWidth }
    }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { ...MODE_TABLE.numeric, bar: { tone: 'steel' } }
    }),
    column.accessor('players', {
      header: t('players'),
      cell: (info) => format.number(info.getValue()),
      meta: { ...MODE_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor((row) => row.winRate ?? undefined, {
      id: 'winRate',
      header: t('winRate'),
      cell: (info) => <WinRateCell value={info.row.original.winRate} />,
      sortUndefined: 'last',
      meta: MODE_TABLE.numeric
    }),
    column.accessor((row) => row.avgDamage ?? undefined, {
      id: 'avgDamage',
      header: t('avgDamage'),
      cell: (info) => amount({ value: info.row.original.avgDamage }),
      sortUndefined: 'last',
      meta: MODE_TABLE.numeric
    }),
    column.accessor((row) => row.avgXp ?? undefined, {
      id: 'avgXp',
      header: t('avgXp'),
      cell: (info) => amount({ value: info.row.original.avgXp }),
      sortUndefined: 'last',
      meta: { ...MODE_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor((row) => row.avgFrags ?? undefined, {
      id: 'avgFrags',
      header: t('avgFrags'),
      cell: (info) => amount({ value: info.row.original.avgFrags, digits: 2 }),
      sortUndefined: 'last',
      meta: { ...MODE_TABLE.numeric, hideBelow: 'lg' }
    }),
    column.accessor((row) => row.survivalRate ?? undefined, {
      id: 'survivalRate',
      header: t('survival'),
      cell: (info) => percentText({ format, value: info.row.original.survivalRate }),
      sortUndefined: 'last',
      meta: { ...MODE_TABLE.numeric, hideBelow: 'xl' }
    })
  ];
};
