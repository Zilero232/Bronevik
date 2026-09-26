import { describe, expect, it, vi } from 'vitest';

import { getPlayer, getTierList } from '../../generated/sdk.gen';
import { createOtmetkiClient } from '../client';
import { OTMETKI_API } from '../client.constants';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const requestOf = (fetch: ReturnType<typeof vi.fn<typeof globalThis.fetch>>): Request => {
  const [input] = fetch.mock.calls[0] ?? [];

  if (!(input instanceof Request)) {
    throw new TypeError('expected a Request');
  }

  return input;
};

describe('createOtmetkiClient', () => {
  it('sends the API key and resolves the path against the base URL', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(json({ mode: 'random', period: '7d', generatedAt: '', entries: [] }));
    const client = createOtmetkiClient({ apiKey: 'otm_key', baseUrl: 'https://api.test', fetch });

    await getTierList({ client, query: { period: '7d' } });

    const request = requestOf(fetch);

    expect(request.headers.get(OTMETKI_API.apiKeyHeader)).toBe('otm_key');
    expect(request.url).toBe('https://api.test/v1/tanks/tier-list?period=7d');
  });

  it('returns the parsed body as data', async () => {
    const profile = { summary: { nickname: 'Tanker' }, recent: [] };
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(json(profile));
    const client = createOtmetkiClient({ apiKey: 'otm_key', baseUrl: 'https://api.test', fetch });

    const { data } = await getPlayer({ client, path: { idOrNick: 'Tanker' } });

    expect(data).toEqual(profile);
  });

  it('surfaces the API error body when the key is rejected', async () => {
    const error = { error: 'The API key is not valid', code: 'API_KEY_INVALID' };
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(json(error, 401));
    const client = createOtmetkiClient({ apiKey: 'otm_bad', baseUrl: 'https://api.test', fetch });

    await expect(getPlayer({ client, path: { idOrNick: 'Tanker' }, throwOnError: true })).rejects.toEqual(error);
  });

  it('retries a throttled call by default', async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(json({ error: 'slow down', code: 'RATE_LIMITED' }, 429))
      .mockResolvedValueOnce(json({ mode: 'random', period: '7d', generatedAt: '', entries: [] }));

    const client = createOtmetkiClient({ apiKey: 'otm_key', baseUrl: 'https://api.test', fetch, retry: { delay: () => 0 } });

    const { response } = await getTierList({ client });

    expect(response?.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('waits for Retry-After and gives up after the retry limit', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async () => {
      const response = json({ error: 'slow down', code: 'RATE_LIMITED' }, 429);

      response.headers.set('retry-after', '0');

      return response;
    });

    const client = createOtmetkiClient({ apiKey: 'otm_key', baseUrl: 'https://api.test', fetch, retry: { limit: 2, delay: () => 0 } });

    const { response, error } = await getTierList({ client });

    expect(response?.status).toBe(429);
    expect(error).toEqual({ error: 'slow down', code: 'RATE_LIMITED' });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('makes one attempt when retries are off', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(json({ error: 'slow down', code: 'RATE_LIMITED' }, 429));
    const client = createOtmetkiClient({ apiKey: 'otm_key', baseUrl: 'https://api.test', fetch, retry: false });

    await getTierList({ client });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
