'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, QueryState } from '@/ui-kit';

import { usePaymentHistory } from '../../../model/hooks';

import s from './PaymentHistory.module.scss';

export const PaymentHistory = () => {
  const t = useTranslations('billing.history');
  const { query, columns } = usePaymentHistory();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader title={t('title')} />
      <QueryState
        empty={<EmptyState description={t('emptyHint')} title={t('empty')} />}
        query={query}
        skeleton={<DataTable isLoading caption={t('caption')} columns={columns} data={[]} />}
      >
        {(payments) => (
          <DataTable
            caption={t('caption')}
            columns={columns}
            data={payments}
            getRowId={(row) => row.id}
            initialSorting={[{ id: 'date', desc: true }]}
          />
        )}
      </QueryState>
    </Card>
  );
};
