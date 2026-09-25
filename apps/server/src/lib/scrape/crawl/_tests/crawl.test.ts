import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { crawlPages } from '../crawl';

const server = createServer((request, response) => {
  if (request.url === '/robots.txt') {
    response.end('User-agent: *\nDisallow: /private\n');

    return;
  }

  if (request.url === '/broken') {
    response.statusCode = 500;
    response.end();

    return;
  }

  response.setHeader('content-type', 'text/html; charset=utf-8');
  response.end(`<html><body><h1>${request.url}</h1></body></html>`);
});

let base = '';

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  base = typeof address === 'object' && address ? `http://127.0.0.1:${address.port}` : '';
});

afterAll(() => {
  server.close();
});

describe('crawlPages', () => {
  it('skips paths robots.txt disallows and pages that fail', async () => {
    const pages = await crawlPages({ urls: [`${base}/news`, `${base}/private/page`, `${base}/broken`], delaySecs: 0 });

    expect(pages.map((page) => page.$('h1').text())).toEqual(['/news']);
  });
});
