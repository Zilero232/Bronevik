import { randomBytes } from 'node:crypto';
import { Webhook, WebhookVerificationError } from 'standardwebhooks';
import { describe, expect, it } from 'vitest';

import { verifyWebhook } from '../webhooks';
import { WEBHOOK_HEADERS } from '../webhooks.constants';

const secret = `whsec_${randomBytes(32).toString('base64')}`;
const payload = { id: '8f4c1c2e-0000-4000-8000-000000000001', event: 'mark.gained', createdAt: '2026-09-25T12:00:00.000Z', data: { tankId: 1 } };
const body = JSON.stringify(payload);

const signedHeaders = ({ at = new Date(), key = secret, signedBody = body } = {}) => ({
  [WEBHOOK_HEADERS.id]: payload.id,
  [WEBHOOK_HEADERS.timestamp]: String(Math.floor(at.getTime() / 1000)),
  [WEBHOOK_HEADERS.signature]: new Webhook(key).sign(payload.id, at, signedBody)
});

describe('verifyWebhook', () => {
  it('returns the payload of a delivery signed with the endpoint secret', () => {
    expect(verifyWebhook({ secret, body, headers: signedHeaders() })).toEqual(payload);
  });

  it('reads headers regardless of their case', () => {
    const headers = Object.fromEntries(Object.entries(signedHeaders()).map(([name, value]) => [name.toUpperCase(), value]));

    expect(verifyWebhook({ secret, body, headers })).toEqual(payload);
  });

  it('rejects a body changed after signing', () => {
    expect(() => verifyWebhook({ secret, body: `${body} `, headers: signedHeaders() })).toThrow(WebhookVerificationError);
  });

  it('rejects a signature made with another secret', () => {
    const other = `whsec_${randomBytes(32).toString('base64')}`;

    expect(() => verifyWebhook({ secret, body, headers: signedHeaders({ key: other }) })).toThrow(WebhookVerificationError);
  });

  it('rejects a replayed delivery outside the tolerance window', () => {
    const stale = new Date(Date.now() - 60 * 60 * 1000);

    expect(() => verifyWebhook({ secret, body, headers: signedHeaders({ at: stale }) })).toThrow(WebhookVerificationError);
  });

  it('rejects missing headers', () => {
    expect(() => verifyWebhook({ secret, body, headers: {} })).toThrow(WebhookVerificationError);
  });
});
