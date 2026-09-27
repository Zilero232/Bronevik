import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { HttpClientService, PrismaService } from '../../../../../core';

import { SOURCES } from '../../../../../config';
import { NewsSyncService } from '../news-sync.service';

const rss = (items: string) => `<?xml version="1.0"?><rss version="2.0"><channel><title>News</title>${items}</channel></rss>`;

const item = ({ title, link }: { title: string; link?: string }) =>
  `<item><title>${title}</title>${link ? `<link>${link}</link>` : ''}<pubDate>Fri, 25 Sep 2026 10:00:00 GMT</pubDate></item>`;

const createSync = (inserted: number) => {
  const prisma = mockDeep<PrismaService>();
  const http = mock<HttpClientService>();

  prisma.newsItem.createMany.mockResolvedValue({ count: inserted });

  return { prisma, http, sync: new NewsSyncService(prisma, http) };
};

describe('NewsSyncService.sync', () => {
  it('fetches the configured feed and inserts its items without duplicating known ones', async () => {
    const { prisma, http, sync } = createSync(1);

    http.getText.mockResolvedValue(
      rss(item({ title: 'Update 2.0', link: 'https://tanki.su/news/1' }) + item({ title: 'Stream', link: 'https://tanki.su/news/2' }))
    );

    expect(await sync.sync()).toEqual({ items: 2, inserted: 1 });
    expect(http.getText.mock.calls[0]?.[0].url).toBe(SOURCES.newsRss);
    expect(prisma.newsItem.createMany.mock.calls[0]?.[0]).toMatchObject({ skipDuplicates: true });
  });

  it('drops feed items without a link', async () => {
    const { prisma, http, sync } = createSync(1);

    http.getText.mockResolvedValue(rss(item({ title: 'No link' }) + item({ title: 'Linked', link: 'https://tanki.su/news/3' })));

    expect(await sync.sync()).toEqual({ items: 1, inserted: 1 });
    expect(prisma.newsItem.createMany.mock.calls[0]?.[0]?.data).toEqual([expect.objectContaining({ title: 'Linked' })]);
  });

  it('fails without writing when the feed request fails', async () => {
    const { prisma, http, sync } = createSync(0);

    http.getText.mockRejectedValue(new Error('HTTP 503'));

    await expect(sync.sync()).rejects.toThrow();
    expect(prisma.newsItem.createMany).not.toHaveBeenCalled();
  });
});
