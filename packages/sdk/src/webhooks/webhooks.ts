import { Webhook, WebhookVerificationError } from 'standardwebhooks';

import type { BronevikWebhook, VerifyWebhookInput, WebhookHeaders } from './webhooks.types';

const flatHeaders = (headers: WebhookHeaders): Record<string, string> =>
  Object.fromEntries(
    Object.entries(headers).flatMap(([name, value]) =>
      value === undefined ? [] : [[name.toLowerCase(), Array.isArray(value) ? value.join(',') : value]]
    )
  );

const isBronevikWebhook = (value: unknown): value is BronevikWebhook =>
  typeof value === 'object' && value !== null && 'id' in value && 'event' in value && 'data' in value;

export const verifyWebhook = ({ secret, body, headers }: VerifyWebhookInput): BronevikWebhook => {
  const payload = new Webhook(secret).verify(body, flatHeaders(headers));

  if (!isBronevikWebhook(payload)) {
    throw new WebhookVerificationError('The payload is not a Bronevik webhook');
  }

  return payload;
};
