import type { WebhookEndpoint } from '@bronevik/schemas';

export type WebhookRowProps = {
  endpoint: WebhookEndpoint;
  onEdit: (endpoint: WebhookEndpoint) => void;
  onDelete: (endpoint: WebhookEndpoint) => void;
};
