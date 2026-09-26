'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { usePaymentHistory } from '../../../model/hooks';

import s from './PaymentHistory.module.scss';

export const PaymentHistory = () => {
  const t = useTranslations('billing.history');
  const { payments, columns, isPending, isError, isRetrying, retry } = usePaymentHistory();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader title={t('title')} />
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={payments}
        emptyState={isError ? <ErrorState isRetrying={isRetrying} onRetry={retry} /> : <EmptyState description={t('emptyHint')} title={t('empty')} />}
        getRowId={(row) => row.id}
        initialSorting={[{ id: 'date', desc: true }]}
        isLoading={isPending}
      />
    </Card>
  );
};
