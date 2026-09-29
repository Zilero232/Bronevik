'use client';

import type { WebhookDelivery } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { RelativeTime } from '@/ui-kit';

import { DeliveryStatusCell, EventCell } from '../../../ui/components/DeliveriesLog/components';

const column = createColumnHelper<WebhookDelivery>();

export const useDeliveriesLogColumns = (): TableColumn<WebhookDelivery>[] => {
  const t = useTranslations('developer.deliveries');

  return [
    column.accessor('event', { header: t('event'), cell: ({ getValue }) => <EventCell event={getValue()} /> }),
    column.accessor('status', { header: t('status'), cell: ({ getValue }) => <DeliveryStatusCell status={getValue()} /> }),
    column.accessor('attempt', { header: t('attempt'), meta: { align: 'end', isNumeric: true, hideBelow: 'md' } }),
    column.accessor('responseStatus', {
      header: t('response'),
      cell: ({ getValue }) => getValue() ?? '—',
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('createdAt', { header: t('created'), cell: ({ getValue }) => <RelativeTime value={getValue()} /> }),
    column.accessor('deliveredAt', {
      header: t('delivered'),
      cell: ({ getValue }) => <RelativeTime value={getValue()} />,
      meta: { hideBelow: 'lg' }
    }),
    column.accessor('nextAttemptAt', {
      header: t('nextAttempt'),
      cell: ({ getValue }) => <RelativeTime value={getValue()} />,
      meta: { hideBelow: 'lg' }
    })
  ];
};
