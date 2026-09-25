'use client';

import type { PaymentHistoryItem } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { Hand, Repeat } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import { paymentTone } from '../../../lib/status-tone';

import s from './PaymentHistory.module.scss';

const column = createColumnHelper<PaymentHistoryItem>();

export const usePaymentColumns = (): ColumnDef<PaymentHistoryItem, never>[] => {
  const t = useTranslations('billing.history');
  const format = useFormatter();

  return [
    column.accessor((row) => Date.parse(row.createdAt), {
      id: 'date',
      header: t('columns.date'),
      cell: ({ row }) => <span className={s.date}>{format.dateTime(new Date(row.original.createdAt), { dateStyle: 'medium' })}</span>
    }),
    column.accessor('amount', {
      header: t('columns.amount'),
      cell: ({ row }) => (
        <span className={s.amount}>{format.number(row.original.amount, { style: 'currency', currency: row.original.currency })}</span>
      ),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.plan ?? '', {
      id: 'plan',
      header: t('columns.plan'),
      cell: ({ row }) => (row.original.plan ? t(`plans.${row.original.plan}`) : <span className={s.dim}>—</span>)
    }),
    column.accessor('status', {
      header: t('columns.status'),
      cell: ({ row }) => <Badge tone={paymentTone(row.original.status)}>{t(`statuses.${row.original.status}`)}</Badge>
    }),
    column.accessor('isAutoCharge', {
      header: t('columns.charge'),
      cell: ({ row }) => (
        <span className={s.charge}>
          {row.original.isAutoCharge ? <Repeat aria-hidden size={14} /> : <Hand aria-hidden size={14} />}
          {t(row.original.isAutoCharge ? 'auto' : 'manual')}
        </span>
      )
    }),
    column.accessor((row) => row.promoCode ?? '', {
      id: 'promo',
      header: t('columns.promo'),
      cell: ({ row }) => (row.original.promoCode ? <code className={s.code}>{row.original.promoCode}</code> : <span className={s.dim}>—</span>)
    })
  ];
};
