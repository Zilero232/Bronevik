import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { ScrapeSummary } from './supertest-scrape.types';

import { PrismaService } from '../../../core';
import { crawlPages, textLines } from '../../../lib/scrape';
import { SUPERTEST_SCRAPE, SUPERTEST_SOURCES } from '../config';
import { isSupertestTitle, parseSupertestArticle } from '../lib';
import { SupertestStoreService } from './supertest-store.service';

@Injectable()
export class SupertestScrapeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly store: SupertestStoreService
  ) {}

  async run(now: Date): Promise<ScrapeSummary> {
    const news = await this.prisma.newsItem.findMany({
      where: {
        source: SUPERTEST_SOURCES.official,
        publishedAt: { gte: subDays(now, SUPERTEST_SCRAPE.lookbackDays) },
        OR: SUPERTEST_SCRAPE.titleNeedles.map((needle) => ({ title: { contains: needle, mode: 'insensitive' as const } }))
      },
      orderBy: { publishedAt: 'desc' },
      select: { url: true, title: true, summary: true, image: true, publishedAt: true }
    });

    const candidates = news.filter((item) => isSupertestTitle(item.title));
    const parsed = await this.prisma.supertestAnnouncement.findMany({
      where: { url: { in: candidates.map((item) => item.url) }, parsedAt: { not: null } },
      select: { url: true }
    });

    const parsedUrls = new Set(parsed.map((row) => row.url));
    const fresh = candidates.filter((item) => !parsedUrls.has(item.url)).slice(0, SUPERTEST_SCRAPE.maxPages);

    if (fresh.length === 0) {
      return { seen: candidates.length, fetched: 0, stored: 0, changes: 0 };
    }

    const pages = await crawlPages({ urls: fresh.map((item) => item.url) });
    const vehicles = await this.prisma.vehicle.findMany({ select: { tankId: true, name: true } });
    let stored = 0;
    let changes = 0;

    for (const item of fresh) {
      const page = pages.find((candidate) => candidate.url === item.url);

      if (!page) {
        continue;
      }

      changes += await this.store.store({
        announcement: { ...item, source: SUPERTEST_SOURCES.official },
        tanks: parseSupertestArticle({ lines: textLines(page.$), vehicles }),
        now
      });

      stored += 1;
    }

    return { seen: candidates.length, fetched: pages.length, stored, changes };
  }
}
