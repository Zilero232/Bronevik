'use client';

import { useTranslations } from 'next-intl';

import { DataTable, QueryState } from '@/ui-kit';

import type { DeliveriesLogProps } from './DeliveriesLog.types';

import { useDeliveriesLogColumns, useWebhookDeliveries } from '../../../model/hooks';

import s from './DeliveriesLog.module.scss';

export const DeliveriesLog = ({ webhookId }: DeliveriesLogProps) => {
  const t = useTranslations('developer.deliveries');
  const query = useWebhookDeliveries(webhookId);
  const columns = useDeliveriesLogColumns();

  return (
    <div className={s.root}>
      <QueryState
        empty={<p className={s.empty}>{t('empty')}</p>}
        query={query}
        skeleton={<DataTable isLoading caption={t('caption')} columns={columns} data={[]} />}
      >
        {(deliveries) => (
          <DataTable
            caption={t('caption')}
            columns={columns}
            data={deliveries}
            getRowId={({ id }) => id}
            initialSorting={[{ id: 'createdAt', desc: true }]}
          />
        )}
      </QueryState>
    </div>
  );
};
