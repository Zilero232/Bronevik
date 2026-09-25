import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { verifyWebhookSignature } from '../webhooks';
import { WEBHOOK_SIGNATURE } from '../webhooks.constants';

const secret = 'whsec_test';
const body = JSON.stringify({ id: '1', event: 'mark.gained', data: { tankId: 1 } });
const now = new Date('2026-09-25T12:00:00Z');
const timestamp = String(Math.floor(now.getTime() / 1000));

const sign = (payload: string, at = timestamp) =>
  `${WEBHOOK_SIGNATURE.scheme}${createHmac('sha256', secret).update(`${at}.${payload}`).digest('hex')}`;

describe('verifyWebhookSignature', () => {
  it('accepts a delivery signed with the endpoint secret', async () => {
    expect(await verifyWebhookSignature({ secret, body, signature: sign(body), timestamp, now })).toBe(true);
  });

  it('rejects a body changed after signing', async () => {
    expect(await verifyWebhookSignature({ secret, body: `${body} `, signature: sign(body), timestamp, now })).toBe(false);
  });

  it('rejects a signature made with another secret', async () => {
    const forged = `${WEBHOOK_SIGNATURE.scheme}${createHmac('sha256', 'other').update(`${timestamp}.${body}`).digest('hex')}`;

    expect(await verifyWebhookSignature({ secret, body, signature: forged, timestamp, now })).toBe(false);
  });

  it('rejects a replay older than the tolerance', async () => {
    const stale = String(Number(timestamp) - WEBHOOK_SIGNATURE.toleranceSec - 1);

    expect(await verifyWebhookSignature({ secret, body, signature: sign(body, stale), timestamp: stale, now })).toBe(false);
  });

  it('rejects missing headers', async () => {
    expect(await verifyWebhookSignature({ secret, body, signature: undefined, timestamp, now })).toBe(false);
    expect(await verifyWebhookSignature({ secret, body, signature: sign(body), timestamp: null, now })).toBe(false);
  });
});
