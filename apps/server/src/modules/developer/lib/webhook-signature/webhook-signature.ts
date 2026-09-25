import { WEBHOOK } from '@bronevik/schemas';
import { randomBytes } from 'node:crypto';

import type { SignWebhookInput, WebhookHeadersInput } from './webhook-signature.types';

import { hmacSha256Hex } from '../../../../common/lib';
import { WEBHOOK_DELIVERY } from '../../config';

export const generateWebhookSecret = (): string => `whsec_${randomBytes(WEBHOOK_DELIVERY.secretBytes).toString('base64url')}`;

export const signWebhook = ({ secret, timestamp, body }: SignWebhookInput): string =>
  `${WEBHOOK.signatureScheme}=${hmacSha256Hex({ key: secret, data: `${timestamp}.${body}` })}`;

export const webhookHeaders = ({ secret, body, event, deliveryId, timestamp }: WebhookHeadersInput): Record<string, string> => ({
  'content-type': 'application/json',
  'user-agent': WEBHOOK_DELIVERY.userAgent,
  [WEBHOOK.eventHeader]: event,
  [WEBHOOK.deliveryHeader]: deliveryId,
  [WEBHOOK.timestampHeader]: String(timestamp),
  [WEBHOOK.signatureHeader]: signWebhook({ secret, timestamp, body })
});
