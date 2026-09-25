import { describe, expect, it, vi } from 'vitest';

import { isRetryableStatus, retryAfterMs, retryingFetch } from '../retry';
import { RETRY } from '../retry.constants';

const respond = (status: number, headers: Record<string, string> = {}) => new Response(status === 204 ? null : '{}', { status, headers });

const fast = { minTimeoutMs: 1, maxTimeoutMs: 1 };

describe('retryingFetch', () => {
  it('retries a throttled request until it succeeds', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValueOnce(respond(429)).mockResolvedValueOnce(respond(200));

    const response = await retryingFetch({ fetch, ...fast })('https://api.test/v1/tanks');

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('hands back the last response once the retries run out', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async () => respond(503));

    const response = await retryingFetch({ fetch, retries: 2, ...fast })('https://api.test/v1/tanks');

    expect(response.status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('does not retry a client error', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(respond(404));

    const response = await retryingFetch({ fetch, ...fast })('https://api.test/v1/players/1');

    expect(response.status).toBe(404);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('waits as long as Retry-After asks', async () => {
    const sleep = vi.fn(async () => {});
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(respond(429, { 'retry-after': '2' }))
      .mockResolvedValueOnce(respond(200));

    await retryingFetch({ fetch, sleep, ...fast })('https://api.test/v1/tanks');

    expect(sleep).toHaveBeenCalledWith(2_000);
  });

  it('retries a network failure', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValueOnce(respond(200));

    const response = await retryingFetch({ fetch, ...fast })('https://api.test/v1/tanks');

    expect(response.status).toBe(200);
  });
});

describe('retryAfterMs', () => {
  it('reads seconds and caps a very long wait', () => {
    expect(retryAfterMs('3')).toBe(3_000);
    expect(retryAfterMs(String(RETRY.maxRetryAfterMs))).toBe(RETRY.maxRetryAfterMs);
  });

  it('ignores a missing or past value', () => {
    expect(retryAfterMs(null)).toBeNull();
    expect(retryAfterMs('0')).toBeNull();
    expect(retryAfterMs(new Date(Date.now() - 60_000).toUTCString())).toBeNull();
  });
});

describe('isRetryableStatus', () => {
  it('retries throttling and server errors only', () => {
    expect(RETRY.statuses.every(isRetryableStatus)).toBe(true);
    expect([200, 400, 401, 404].some(isRetryableStatus)).toBe(false);
  });
});
