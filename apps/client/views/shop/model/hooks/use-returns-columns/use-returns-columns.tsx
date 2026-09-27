'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import type { ReturnRow } from '../use-offer-returns';

import { NextReturnCell, ReturnTankCell } from '../../../ui/components/ReturnsTable/components';

const column = createColumnHelper<ReturnRow>();

export const useReturnsColumns = (): TableColumn<ReturnRow>[] => {
  const t = useTranslations('shop.returns');
  const format = useFormatter();

  return [
    column.accessor((row) => row.vehicle?.shortName ?? row.tankName ?? '', {
      id: 'tank',
      header: t('columns.tank'),
      cell: ({ row: { original } }) => <ReturnTankCell row={original} />
    }),
    column.accessor('timesSeen', {
      header: t('columns.timesSeen'),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor((row) => row.lastSeenAt ?? '', {
      id: 'lastSeenAt',
      header: t('columns.lastSeen'),
      cell: ({ row: { original } }) => (original.lastSeenAt ? format.dateTime(new Date(original.lastSeenAt), { dateStyle: 'medium' }) : '—'),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor((row) => row.lastDiscountPercent ?? -1, {
      id: 'discount',
      header: t('columns.discount'),
      cell: ({ row: { original } }) => (original.lastDiscountPercent === null ? '—' : `−${original.lastDiscountPercent}%`),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.medianIntervalDays ?? Number.POSITIVE_INFINITY, {
      id: 'interval',
      header: t('columns.interval'),
      cell: ({ row: { original } }) => (original.medianIntervalDays === null ? '—' : t('days', { count: Math.round(original.medianIntervalDays) })),
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    }),
    column.accessor((row) => row.nextExpectedAt ?? '9999', {
      id: 'next',
      header: t('columns.next'),
      cell: ({ row: { original } }) => <NextReturnCell row={original} />,
      meta: { align: 'end' }
    })
  ];
};
