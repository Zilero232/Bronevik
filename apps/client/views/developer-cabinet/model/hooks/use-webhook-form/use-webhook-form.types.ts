import type { WebhookEndpoint } from '@otmetki/schemas';

export type UseWebhookFormInput = {
  endpoint: WebhookEndpoint | null;
  onCreated: (secret: string) => void;
  onSaved: () => void;
};
