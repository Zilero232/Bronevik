import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { postWebhook, WebhookResponseError } from '../webhook-post';

const server = createServer((request, response) => {
  if (request.url === '/large') {
    response.writeHead(200);
    response.end('x'.repeat(100_000));

    return;
  }

  if (request.url === '/fail') {
    response.writeHead(500);
    response.end('boom');

    return;
  }

  request.resume();

  request.on('end', () => {
    response.writeHead(request.headers.host?.startsWith('hooks.test') ? 204 : 421);
    response.end();
  });
});

let base = '';

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();

  base = `http://hooks.test:${typeof address === 'object' && address ? address.port : 0}`;
});

afterAll(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

const post = (path: string) =>
  postWebhook({
    url: `${base}${path}`,
    body: '{}',
    headers: { 'content-type': 'application/json' },
    address: '127.0.0.1',
    timeoutMs: 5_000,
    maxBodyBytes: 1_000
  });

describe('postWebhook', () => {
  it('connects to the pinned address while naming the original host', async () => {
    await expect(post('/ok')).resolves.toEqual({ status: 204, body: '' });
  });

  it('keeps no more of the answer than the limit', async () => {
    const response = await post('/large');

    expect(response.body).toHaveLength(1_000);
  });

  it('treats a non-2xx answer as a failure with its status and body', async () => {
    const error = await post('/fail').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(WebhookResponseError);
    expect(error).toMatchObject({ response: { status: 500, body: 'boom' } });
  });
});
