import type { WebhookEndpoint } from '@bronevik/schemas';

export type UseWebhookFormInput = {
  endpoint: WebhookEndpoint | null;
  onCreated: (secret: string) => void;
  onSaved: () => void;
};
