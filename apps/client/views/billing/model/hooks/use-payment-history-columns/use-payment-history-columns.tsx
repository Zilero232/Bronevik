'use client';

import type { PaymentHistoryItem } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { AmountCell, ChargeCell, DateCell, PlanCell, PromoCell, StatusCell } from '../../../ui/components/PaymentHistory/components';

const column = createColumnHelper<PaymentHistoryItem>();

export const usePaymentHistoryColumns = (): ColumnDef<PaymentHistoryItem, never>[] => {
  const t = useTranslations('billing.history.columns');

  return [
    column.accessor((row) => Date.parse(row.createdAt), {
      id: 'date',
      header: t('date'),
      cell: ({ row }) => <DateCell createdAt={row.original.createdAt} />
    }),
    column.accessor('amount', {
      header: t('amount'),
      cell: ({ row }) => <AmountCell amount={row.original.amount} currency={row.original.currency} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.plan ?? '', {
      id: 'plan',
      header: t('plan'),
      cell: ({ row }) => <PlanCell plan={row.original.plan} />
    }),
    column.accessor('status', {
      header: t('status'),
      cell: ({ row }) => <StatusCell status={row.original.status} />
    }),
    column.accessor('isAutoCharge', {
      header: t('charge'),
      cell: ({ row }) => <ChargeCell isAutoCharge={row.original.isAutoCharge} />
    }),
    column.accessor((row) => row.promoCode ?? '', {
      id: 'promo',
      header: t('promo'),
      cell: ({ row }) => <PromoCell promoCode={row.original.promoCode} />
    })
  ];
};
