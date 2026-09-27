import type { WebhookEndpoint } from '@otmetki/schemas';

export type WebhookFormProps = {
  endpoint: WebhookEndpoint | null;
  onCreated: (secret: string) => void;
  onSaved: () => void;
};
