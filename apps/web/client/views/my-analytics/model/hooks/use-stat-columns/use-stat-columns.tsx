'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { WinRateCell } from '@/entities/tank/tank';
import { DeltaCell, NumberCell } from '@/ui-kit';

import type { StatColumnsRow, WinRateDeltaHeader, WinRateDeltaRow } from './use-stat-columns.types';

import { ANALYTICS_COLUMNS } from '../../../config';

export const useStatColumns = <T extends StatColumnsRow>(): TableColumn<T>[] => {
  const t = useTranslations('analytics.columns');
  const column = createColumnHelper<T>();

  return [
    column.accessor((row) => row.battles, {
      id: 'battles',
      header: t('battles'),
      cell: ({ row }) => <NumberCell value={row.original.battles} />,
      meta: { ...ANALYTICS_COLUMNS.numeric, bar: { tone: 'steel' } }
    }),
    column.accessor((row) => row.winRate ?? -1, {
      id: 'winRate',
      header: t('winRate'),
      cell: ({ row }) => <WinRateCell value={row.original.winRate} />,
      meta: ANALYTICS_COLUMNS.numeric
    }),
    column.accessor((row) => row.avgDamage ?? -1, {
      id: 'avgDamage',
      header: t('avgDamage'),
      cell: ({ row }) => <NumberCell value={row.original.avgDamage} />,
      meta: { ...ANALYTICS_COLUMNS.numeric, hideBelow: 'md' }
    })
  ];
};

export const useWinRateDeltaColumn = <T extends WinRateDeltaRow>(header: WinRateDeltaHeader): TableColumn<T> => {
  const t = useTranslations('analytics.columns');
  const column = createColumnHelper<T>();

  return column.accessor((row) => row.winRateDelta ?? 0, {
    id: 'winRateDelta',
    header: t(header),
    cell: ({ row }) => <DeltaCell suffix={t('pointsSuffix')} value={row.original.winRateDelta} />,
    meta: ANALYTICS_COLUMNS.numeric
  });
};
