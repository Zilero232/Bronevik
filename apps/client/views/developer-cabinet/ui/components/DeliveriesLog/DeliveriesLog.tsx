'use client';

import { useTranslations } from 'next-intl';

import { DataTable, ErrorState } from '@/ui-kit';

import type { DeliveriesLogProps } from './DeliveriesLog.types';

import { useDeliveriesLogColumns, useWebhookDeliveries } from '../../../model/hooks';

import s from './DeliveriesLog.module.scss';

export const DeliveriesLog = ({ webhookId }: DeliveriesLogProps) => {
  const t = useTranslations('developer.deliveries');
  const { data: deliveries, isPending, isError, isFetching, refetch } = useWebhookDeliveries(webhookId);
  const columns = useDeliveriesLogColumns();

  return (
    <div className={s.root}>
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={deliveries ?? []}
        emptyState={isError ? <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} /> : <p className={s.empty}>{t('empty')}</p>}
        getRowId={({ id }) => id}
        initialSorting={[{ id: 'createdAt', desc: true }]}
        isLoading={isPending}
      />
    </div>
  );
};
