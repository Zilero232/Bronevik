import type { WebhookDelivery } from '@otmetki/schemas';

export type EventCellProps = Pick<WebhookDelivery, 'event'>;
