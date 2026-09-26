import { randomBytes } from 'node:crypto';
import { Webhook, WebhookVerificationError } from 'standardwebhooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { verifyWebhook } from '../webhooks';
import { WEBHOOK_HEADERS } from '../webhooks.constants';

const NOW = new Date('2026-09-26T12:00:00Z');

const STANDARD_WEBHOOKS_TOLERANCE_SECONDS = 5 * 60;

const secondsFromNow = (seconds: number) => new Date(NOW.getTime() + seconds * 1000);

const secret = `whsec_${randomBytes(32).toString('base64')}`;
const payload = { id: '8f4c1c2e-0000-4000-8000-000000000001', event: 'mark.gained', createdAt: '2026-09-25T12:00:00.000Z', data: { tankId: 1 } };
const body = JSON.stringify(payload);

const signedHeaders = ({ at = NOW, key = secret, signedBody = body } = {}) => ({
  [WEBHOOK_HEADERS.id]: payload.id,
  [WEBHOOK_HEADERS.timestamp]: String(Math.floor(at.getTime() / 1000)),
  [WEBHOOK_HEADERS.signature]: new Webhook(key).sign(payload.id, at, signedBody)
});

describe('verifyWebhook', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('accepts a delivery signed exactly at the edge of the tolerance window', () => {
    const edge = secondsFromNow(-STANDARD_WEBHOOKS_TOLERANCE_SECONDS);

    expect(verifyWebhook({ secret, body, headers: signedHeaders({ at: edge }) })).toEqual(payload);
  });

  it('rejects a replayed delivery one second outside the tolerance window', () => {
    const stale = secondsFromNow(-(STANDARD_WEBHOOKS_TOLERANCE_SECONDS + 1));

    expect(() => verifyWebhook({ secret, body, headers: signedHeaders({ at: stale }) })).toThrow(WebhookVerificationError);
  });

  it('rejects a delivery stamped too far in the future', () => {
    const early = secondsFromNow(STANDARD_WEBHOOKS_TOLERANCE_SECONDS + 1);

    expect(() => verifyWebhook({ secret, body, headers: signedHeaders({ at: early }) })).toThrow(WebhookVerificationError);
  });

  it('rejects missing headers', () => {
    expect(() => verifyWebhook({ secret, body, headers: {} })).toThrow(WebhookVerificationError);
  });
});
