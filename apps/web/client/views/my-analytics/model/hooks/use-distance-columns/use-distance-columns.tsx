'use client';

import type { RngDistance } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { NumberCell } from '@/ui-kit';

import { PercentCell } from '../../../ui/components/BreakdownPanel/components';

const column = createColumnHelper<RngDistance>();

export const useDistanceColumns = (): TableColumn<RngDistance>[] => {
  const t = useTranslations('analytics.columns');

  return [
    column.accessor('from', {
      header: t('distance'),
      cell: ({ row }) =>
        row.original.to === null
          ? t('distanceFrom', { from: row.original.from })
          : t('distanceRange', { from: row.original.from, to: row.original.to })
    }),
    column.accessor('shots', {
      header: t('shots'),
      cell: ({ row }) => <NumberCell value={row.original.shots} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('pierced', {
      header: t('pierced'),
      cell: ({ row }) => <NumberCell value={row.original.pierced} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor((row) => row.penRate ?? -1, {
      id: 'penRate',
      header: t('penRate'),
      cell: ({ row }) => <PercentCell value={row.original.penRate} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
