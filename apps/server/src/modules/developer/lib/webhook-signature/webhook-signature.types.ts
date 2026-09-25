import type { WebhookEvent } from '@bronevik/schemas';

export type SignWebhookInput = {
  secret: string;
  timestamp: number;
  body: string;
};

export type WebhookHeadersInput = SignWebhookInput & {
  event: WebhookEvent;
  deliveryId: string;
};
