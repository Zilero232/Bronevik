import type { WebhookEvent } from '@otmetki/schemas';

export type WebhookHeadersInput = {
  secret: string;
  body: string;
  event: WebhookEvent;
  deliveryId: string;
  sentAt: Date;
};
