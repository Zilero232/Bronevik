'use client';

import type { SessionCompareRow } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { DeltaCell } from '@/ui-kit';

import { Wn8Cell } from '../../../ui/components/BreakdownPanel/components';
import { DateCell } from '../../../ui/components/SessionsTable/components';
import { useStatColumns, useWinRateDeltaColumn } from '../use-stat-columns';

const column = createColumnHelper<SessionCompareRow>();

export const useSessionsColumns = (): ColumnDef<SessionCompareRow, never>[] => {
  const t = useTranslations('analytics.columns');
  const stats = useStatColumns<SessionCompareRow>();
  const winRateDelta = useWinRateDeltaColumn<SessionCompareRow>('winRateDelta');

  return [
    column.accessor((row) => Date.parse(row.startedAt), {
      id: 'startedAt',
      header: t('startedAt'),
      cell: ({ row }) => <DateCell value={row.original.startedAt} />
    }),
    ...stats,
    winRateDelta,
    column.accessor((row) => row.avgDamageDelta ?? 0, {
      id: 'avgDamageDelta',
      header: t('avgDamageDelta'),
      cell: ({ row }) => <DeltaCell value={row.original.avgDamageDelta} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8 ?? -1, {
      id: 'wn8',
      header: t('wn8'),
      cell: ({ row }) => <Wn8Cell value={row.original.wn8} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
