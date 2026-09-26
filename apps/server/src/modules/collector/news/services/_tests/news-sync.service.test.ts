import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../../core';

import { SOURCES } from '../../../../../config';
import { NewsSyncService } from '../news-sync.service';

const rss = (items: string) => `<?xml version="1.0"?><rss version="2.0"><channel><title>News</title>${items}</channel></rss>`;

const item = ({ title, link }: { title: string; link?: string }) =>
  `<item><title>${title}</title>${link ? `<link>${link}</link>` : ''}<pubDate>Fri, 25 Sep 2026 10:00:00 GMT</pubDate></item>`;

const serveFeed = (body: string) => {
  const fetch = vi.fn<(input: string | Request | URL) => Promise<Response>>(
    async () => new Response(body, { status: 200, headers: { 'content-type': 'application/rss+xml' } })
  );

  vi.stubGlobal('fetch', fetch);

  return fetch;
};

const createSync = (inserted: number) => {
  const prisma = mockDeep<PrismaService>();

  prisma.newsItem.createMany.mockResolvedValue({ count: inserted });

  return { prisma, sync: new NewsSyncService(prisma) };
};

describe('NewsSyncService.sync', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the configured feed and inserts its items without duplicating known ones', async () => {
    const fetch = serveFeed(
      rss(item({ title: 'Update 2.0', link: 'https://tanki.su/news/1' }) + item({ title: 'Stream', link: 'https://tanki.su/news/2' }))
    );

    const { prisma, sync } = createSync(1);

    expect(await sync.sync()).toEqual({ items: 2, inserted: 1 });
    expect(String(fetch.mock.calls[0]?.[0] instanceof Request ? fetch.mock.calls[0][0].url : fetch.mock.calls[0]?.[0])).toBe(SOURCES.newsRss);
    expect(prisma.newsItem.createMany.mock.calls[0]?.[0]).toMatchObject({ skipDuplicates: true });
  });

  it('drops feed items without a link', async () => {
    serveFeed(rss(item({ title: 'No link' }) + item({ title: 'Linked', link: 'https://tanki.su/news/3' })));
    const { prisma, sync } = createSync(1);

    expect(await sync.sync()).toEqual({ items: 1, inserted: 1 });
    expect(prisma.newsItem.createMany.mock.calls[0]?.[0]?.data).toEqual([expect.objectContaining({ title: 'Linked' })]);
  });

  it('fails without writing when the feed request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('down', { status: 503 }))
    );

    const { prisma, sync } = createSync(0);

    await expect(sync.sync()).rejects.toThrow();
    expect(prisma.newsItem.createMany).not.toHaveBeenCalled();
  });
});
