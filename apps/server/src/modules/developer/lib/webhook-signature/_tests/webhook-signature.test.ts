import { WEBHOOK } from '@bronevik/schemas';
import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { generateWebhookSecret, signWebhook, webhookHeaders } from '../webhook-signature';

const secret = 'whsec_test';
const body = '{"event":"mark.gained"}';
const timestamp = 1_790_000_000;

describe('signWebhook', () => {
  it('signs the timestamp and the raw body together with HMAC-SHA256', () => {
    const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');

    expect(signWebhook({ secret, timestamp, body })).toBe(`${WEBHOOK.signatureScheme}=${expected}`);
  });

  it('changes with the timestamp, so a replayed delivery cannot reuse it', () => {
    expect(signWebhook({ secret, timestamp, body })).not.toBe(signWebhook({ secret, timestamp: timestamp + 1, body }));
  });
});

describe('webhookHeaders', () => {
  it('carries the event, the delivery id, the timestamp and the signature', () => {
    const headers = webhookHeaders({ secret, body, event: 'mark.gained', deliveryId: 'delivery', timestamp });

    expect(headers[WEBHOOK.eventHeader]).toBe('mark.gained');
    expect(headers[WEBHOOK.deliveryHeader]).toBe('delivery');
    expect(headers[WEBHOOK.timestampHeader]).toBe(String(timestamp));
    expect(headers[WEBHOOK.signatureHeader]).toBe(signWebhook({ secret, timestamp, body }));
  });
});

describe('generateWebhookSecret', () => {
  it('creates a distinct secret every time', () => {
    expect(generateWebhookSecret()).not.toBe(generateWebhookSecret());
  });
});
