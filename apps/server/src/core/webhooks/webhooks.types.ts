import type { WebhookEvent } from '@bronevik/schemas';

export type WebhookSubject = {
  accountIds: number[];
  clanIds: number[];
};

export type EmitWebhookInput = {
  event: WebhookEvent;
  subject: WebhookSubject;
  data: Record<string, unknown>;
};

export type WebhookEmitter = {
  emit: (input: EmitWebhookInput) => Promise<number>;
};
