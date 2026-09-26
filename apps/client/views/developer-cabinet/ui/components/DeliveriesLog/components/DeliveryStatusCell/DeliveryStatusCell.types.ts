import type { WebhookDelivery } from '@bronevik/schemas';

export type DeliveryStatusCellProps = Pick<WebhookDelivery, 'status'>;
