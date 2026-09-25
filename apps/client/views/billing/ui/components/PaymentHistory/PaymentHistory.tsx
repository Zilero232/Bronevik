'use client';

import { ReceiptText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState } from '@/ui-kit';

import { usePaymentHistory } from '../../../model/hooks';
import { usePaymentColumns } from './PaymentHistory.columns';

import s from './PaymentHistory.module.scss';

export const PaymentHistory = () => {
  const t = useTranslations('billing.history');
  const { data: payments, isPending } = usePaymentHistory();
  const columns = usePaymentColumns();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('eyebrow')} title={t('title')} />
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={payments ?? []}
        emptyState={<EmptyState description={t('emptyHint')} icon={<ReceiptText size={28} />} title={t('empty')} />}
        getRowId={(row) => row.id}
        initialSorting={[{ id: 'date', desc: true }]}
        isLoading={isPending}
      />
    </Card>
  );
};
