import { WEBHOOK } from '@otmetki/schemas';
import { Webhook, WebhookVerificationError } from 'standardwebhooks';
import { describe, expect, it } from 'vitest';

import { generateWebhookSecret, webhookHeaders } from '../webhook-signature';

const secret = generateWebhookSecret();
const body = '{"event":"mark.gained"}';
const sentAt = new Date();
const headers = webhookHeaders({ secret, body, event: 'mark.gained', deliveryId: 'msg_delivery', sentAt });

describe('webhookHeaders', () => {
  it('produces a delivery that a Standard Webhooks verifier accepts', () => {
    expect(new Webhook(secret).verify(body, headers)).toEqual(JSON.parse(body));
  });

  it('fails verification once the body is changed', () => {
    expect(() => new Webhook(secret).verify(`${body} `, headers)).toThrow(WebhookVerificationError);
  });

  it('fails verification with another endpoint secret', () => {
    expect(() => new Webhook(generateWebhookSecret()).verify(body, headers)).toThrow(WebhookVerificationError);
  });

  it('carries the event and uses the delivery id as the message id', () => {
    expect(headers[WEBHOOK.eventHeader]).toBe('mark.gained');
    expect(headers[WEBHOOK.deliveryHeader]).toBe('msg_delivery');
    expect(headers[WEBHOOK.signatureHeader]?.startsWith(`${WEBHOOK.signatureScheme},`)).toBe(true);
  });
});

describe('generateWebhookSecret', () => {
  it('creates a distinct whsec_ secret every time', () => {
    const next = generateWebhookSecret();

    expect(next.startsWith(WEBHOOK.secretPrefix)).toBe(true);
    expect(next).not.toBe(generateWebhookSecret());
  });
});
