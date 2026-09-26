import { Webhook, WebhookVerificationError } from 'standardwebhooks';

import type { OtmetkiWebhook, VerifyWebhookInput, WebhookHeaders } from './webhooks.types';

const flatHeaders = (headers: WebhookHeaders): Record<string, string> =>
  Object.fromEntries(
    Object.entries(headers).flatMap(([name, value]) =>
      value === undefined ? [] : [[name.toLowerCase(), Array.isArray(value) ? value.join(',') : value]]
    )
  );

const isOtmetkiWebhook = (value: unknown): value is OtmetkiWebhook =>
  typeof value === 'object' && value !== null && 'id' in value && 'event' in value && 'data' in value;

export const verifyWebhook = ({ secret, body, headers }: VerifyWebhookInput): OtmetkiWebhook => {
  const payload = new Webhook(secret).verify(body, flatHeaders(headers));

  if (!isOtmetkiWebhook(payload)) {
    throw new WebhookVerificationError('The payload is not a Three Marks webhook');
  }

  return payload;
};
