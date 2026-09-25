import type { WebhookEndpoint } from '@bronevik/schemas';

export type WebhookFormProps = {
  endpoint: WebhookEndpoint | null;
  onCreated: (secret: string) => void;
  onSaved: () => void;
};
