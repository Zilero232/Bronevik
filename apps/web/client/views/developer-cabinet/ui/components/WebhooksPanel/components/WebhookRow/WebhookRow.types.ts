import type { WebhookEndpoint } from '@otmetki/schemas';

export type WebhookRowProps = {
  endpoint: WebhookEndpoint;
  onEdit: (endpoint: WebhookEndpoint) => void;
  onDelete: (endpoint: WebhookEndpoint) => void;
};
