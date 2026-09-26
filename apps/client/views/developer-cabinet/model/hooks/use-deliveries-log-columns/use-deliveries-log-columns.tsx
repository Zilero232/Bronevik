'use client';

import type { WebhookDelivery } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { DeliveryStatusCell, EventCell } from '../../../ui/components/DeliveriesLog/components';
import { TimeAgo } from '../../../ui/components/TimeAgo';

const column = createColumnHelper<WebhookDelivery>();

export const useDeliveriesLogColumns = (): ColumnDef<WebhookDelivery, never>[] => {
  const t = useTranslations('developer.deliveries');

  return [
    column.accessor('event', { header: t('event'), cell: ({ getValue }) => <EventCell event={getValue()} /> }),
    column.accessor('status', { header: t('status'), cell: ({ getValue }) => <DeliveryStatusCell status={getValue()} /> }),
    column.accessor('attempt', { header: t('attempt'), meta: { align: 'end', isNumeric: true } }),
    column.accessor('responseStatus', { header: t('response'), cell: ({ getValue }) => getValue() ?? '—', meta: { align: 'end', isNumeric: true } }),
    column.accessor('createdAt', { header: t('created'), cell: ({ getValue }) => <TimeAgo value={getValue()} /> }),
    column.accessor('deliveredAt', { header: t('delivered'), cell: ({ getValue }) => <TimeAgo value={getValue()} /> }),
    column.accessor('nextAttemptAt', { header: t('nextAttempt'), cell: ({ getValue }) => <TimeAgo value={getValue()} /> })
  ];
};
