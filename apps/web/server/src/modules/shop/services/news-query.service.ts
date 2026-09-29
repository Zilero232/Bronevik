import { Injectable } from '@nestjs/common';

import type { Prisma } from '../../../../generated';
import type { NewsPage, NewsQuery } from '../shop.types';

import { PrismaService } from '../../../core';
import { NEWS_KIND_TO_DB } from '../config';
import { toNewsView } from '../mappers';

@Injectable()
export class NewsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ kind, tankId, limit, offset }: NewsQuery): Promise<NewsPage> {
    const where: Prisma.NewsItemWhereInput = {
      ...(kind ? { kind: NEWS_KIND_TO_DB[kind] } : {}),
      ...(tankId === undefined ? {} : { tankIds: { has: tankId } })
    };

    const [rows, total] = await Promise.all([
      this.prisma.newsItem.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        take: limit,
        skip: offset,
        include: { gameVersion: { select: { version: true } } }
      }),
      this.prisma.newsItem.count({ where })
    ]);

    return { items: rows.map(toNewsView), total, limit, offset };
  }
}
