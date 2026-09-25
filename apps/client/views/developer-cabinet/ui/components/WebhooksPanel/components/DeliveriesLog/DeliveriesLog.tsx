'use client';

import type { WebhookDelivery } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { Badge, DataTable } from '@/ui-kit';

import type { DeliveriesLogProps } from './DeliveriesLog.types';

import { DELIVERY_STATUS_TONE } from '../../../../../config';
import { useWebhookDeliveries } from '../../../../../model/hooks';
import { TimeAgo } from '../../../TimeAgo';

import s from './DeliveriesLog.module.scss';

const column = createColumnHelper<WebhookDelivery>();

export const DeliveriesLog = ({ webhookId }: DeliveriesLogProps) => {
  const t = useTranslations('developer.deliveries');
  const { data: deliveries, isPending } = useWebhookDeliveries(webhookId);

  const columns: ColumnDef<WebhookDelivery, never>[] = [
    column.accessor('event', { header: t('event'), cell: (info) => <code className={s.event}>{info.getValue()}</code> }),
    column.accessor('status', {
      header: t('status'),
      cell: ({ row: { original } }) => <Badge tone={DELIVERY_STATUS_TONE[original.status]}>{t(`statuses.${original.status}`)}</Badge>
    }),
    column.accessor('attempt', { header: t('attempt'), meta: { align: 'end', isNumeric: true } }),
    column.accessor('responseStatus', { header: t('response'), cell: (info) => info.getValue() ?? '—', meta: { align: 'end', isNumeric: true } }),
    column.accessor('createdAt', { header: t('created'), cell: (info) => <TimeAgo value={info.getValue()} /> }),
    column.accessor('deliveredAt', { header: t('delivered'), cell: (info) => <TimeAgo value={info.getValue()} /> }),
    column.accessor('nextAttemptAt', { header: t('nextAttempt'), cell: (info) => <TimeAgo value={info.getValue()} /> })
  ];

  return (
    <div className={s.root}>
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={deliveries ?? []}
        emptyState={<p className={s.empty}>{t('empty')}</p>}
        getRowId={({ id }) => id}
        initialSorting={[{ id: 'createdAt', desc: true }]}
        isLoading={isPending}
      />
    </div>
  );
};
