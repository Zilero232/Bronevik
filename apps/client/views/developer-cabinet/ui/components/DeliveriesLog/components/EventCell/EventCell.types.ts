import type { WebhookDelivery } from '@bronevik/schemas';

export type EventCellProps = Pick<WebhookDelivery, 'event'>;
