import type { WebhookDelivery } from '@otmetki/schemas';

export type DeliveryStatusCellProps = Pick<WebhookDelivery, 'status'>;
