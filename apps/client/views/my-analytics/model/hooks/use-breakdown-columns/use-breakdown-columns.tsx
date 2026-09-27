'use client';

import type { BreakdownRow } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import type { BreakdownDimension } from '../use-breakdown-panel/use-breakdown-panel.types';

import { BreakdownKeyCell, PercentCell, Wn8Cell } from '../../../ui/components/BreakdownPanel/components';
import { useStatColumns } from '../use-stat-columns';

const column = createColumnHelper<BreakdownRow>();

export const useBreakdownColumns = (dimension: BreakdownDimension): TableColumn<BreakdownRow>[] => {
  const t = useTranslations('analytics.columns');
  const stats = useStatColumns<BreakdownRow>();

  return [
    column.accessor('key', {
      header: t(dimension),
      cell: ({ row }) => <BreakdownKeyCell dimension={dimension} value={row.original.key} />
    }),
    ...stats,
    column.accessor((row) => row.wn8 ?? -1, {
      id: 'wn8',
      header: t('wn8'),
      cell: ({ row }) => <Wn8Cell value={row.original.wn8} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor((row) => row.survivalRate ?? -1, {
      id: 'survivalRate',
      header: t('survivalRate'),
      cell: ({ row }) => <PercentCell value={row.original.survivalRate} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    })
  ];
};
