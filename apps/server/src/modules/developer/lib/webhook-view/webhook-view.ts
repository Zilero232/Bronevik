import type { WebhookDelivery, WebhookEndpoint, WebhookEvent } from '@bronevik/schemas';

import type { WebhookEvent as DbWebhookEvent } from '../../../../../generated';
import type { DeliveryRow, EndpointRow } from './webhook-view.types';

import { toIso } from '../../../../common/lib';
import { WEBHOOK_EVENT_FROM_DB } from '../../config';
import { readWebhookFilter } from '../webhook-match';

export const webhookEventFromDb = (event: DbWebhookEvent): WebhookEvent | null => WEBHOOK_EVENT_FROM_DB[event];

export const toWebhookEndpoint = (row: EndpointRow): WebhookEndpoint => {
  const filter = readWebhookFilter(row.filter);

  return {
    id: row.id,
    url: row.url,
    events: row.events.flatMap((event) => webhookEventFromDb(event) ?? []),
    filter: { accountIds: filter.accountIds, clanIds: filter.clanIds },
    isActive: row.isActive,
    failureCount: row.failureCount,
    disabledAt: toIso(row.disabledAt),
    createdAt: row.createdAt.toISOString()
  };
};

export const toWebhookDelivery = (row: DeliveryRow): WebhookDelivery[] => {
  const event = webhookEventFromDb(row.event);

  return event
    ? [
        {
          id: row.id,
          event,
          status: row.status,
          attempt: row.attempt,
          responseStatus: row.responseStatus,
          createdAt: row.createdAt.toISOString(),
          deliveredAt: toIso(row.deliveredAt),
          nextAttemptAt: toIso(row.nextAttemptAt)
        }
      ]
    : [];
};

export const errorBody = (data: unknown): string | null => {
  if (data === undefined || data === null) {
    return null;
  }

  return typeof data === 'string' ? data : JSON.stringify(data);
};
