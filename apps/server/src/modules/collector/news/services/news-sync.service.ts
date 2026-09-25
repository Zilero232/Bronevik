import { Injectable } from '@nestjs/common';
import Parser from 'rss-parser';

import { SOURCES } from '../../../../config';
import { PrismaService } from '../../../../core';
import { http } from '../../../../lib/http';
import { NEWS } from '../config';
import { toNewsItems } from '../lib/news-feed';

@Injectable()
export class NewsSyncService {
  private readonly parser = new Parser();

  constructor(private readonly prisma: PrismaService) {}

  async sync() {
    const xml = await http.get(SOURCES.newsRss, { timeout: NEWS.timeoutMs, headers: { accept: NEWS.accept } }).text();
    const feed = await this.parser.parseString(xml);
    const items = toNewsItems({ items: feed.items, now: new Date() });
    const { count } = await this.prisma.newsItem.createMany({ data: items, skipDuplicates: true });

    return { items: items.length, inserted: count };
  }
}
