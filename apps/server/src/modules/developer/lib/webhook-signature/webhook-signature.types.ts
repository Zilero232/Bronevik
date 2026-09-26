import type { WebhookEvent } from '@bronevik/schemas';

export type WebhookHeadersInput = {
  secret: string;
  body: string;
  event: WebhookEvent;
  deliveryId: string;
  sentAt: Date;
};
