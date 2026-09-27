'use client';

import type { PlatoonMate } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { MateCell } from '../../../ui/components/PlatoonTab/components';
import { useStatColumns, useWinRateDeltaColumn } from '../use-stat-columns';

const column = createColumnHelper<PlatoonMate>();

export const useMatesColumns = (): TableColumn<PlatoonMate>[] => {
  const t = useTranslations('analytics.columns');
  const stats = useStatColumns<PlatoonMate>();
  const winRateDelta = useWinRateDeltaColumn<PlatoonMate>('winRateVsSolo');

  return [
    column.accessor((row) => row.nickname ?? String(row.accountId), {
      id: 'mate',
      header: t('mate'),
      cell: ({ row }) => <MateCell accountId={row.original.accountId} nickname={row.original.nickname} />
    }),
    ...stats,
    winRateDelta
  ];
};
