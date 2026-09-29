import type { BlogArticle, BlogPostPage, BlogPostSummary, BlogTagCount } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { Prisma } from '../../../../generated';
import type { BlogPostsQuery } from '../blog.types';
import type { BlogPostRow } from '../selects';

import { AppNotFoundException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { BLOG } from '../config';
import { toBlogPostSummary, toBlogPostView } from '../mappers';
import { blogTagsSql } from '../queries';
import { BLOG_POST_INCLUDE, BLOG_POST_ORDER } from '../selects';

@Injectable()
export class BlogQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async list({ category, tag, locale, isFeatured, limit, offset }: BlogPostsQuery): Promise<BlogPostPage> {
    const where: Prisma.BlogPostWhereInput = {
      status: 'published',
      ...(category ? { category } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(locale ? { locale } : {}),
      ...(isFeatured === undefined ? {} : { isFeatured })
    };

    const [rows, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: [...BLOG_POST_ORDER],
        take: limit,
        skip: offset,
        include: BLOG_POST_INCLUDE
      }),
      this.prisma.blogPost.count({ where })
    ]);

    return { items: rows.map((post) => this.summary(post)), total, limit, offset };
  }

  async article(slug: string): Promise<BlogArticle> {
    const post = await this.prisma.blogPost.findFirst({ where: { slug, status: 'published' }, include: BLOG_POST_INCLUDE });

    if (!post) {
      throw new AppNotFoundException('NOT_FOUND', `No blog post ${slug}`);
    }

    const related = await this.prisma.blogPost.findMany({
      where: {
        status: 'published',
        id: { not: post.id },
        OR: [{ category: post.category }, ...(post.tags.length > 0 ? [{ tags: { hasSome: post.tags } }] : [])]
      },
      orderBy: [...BLOG_POST_ORDER],
      take: BLOG.relatedLimit,
      include: BLOG_POST_INCLUDE
    });

    return { post: toBlogPostView({ post, apiUrl: this.apiUrl() }), related: related.map((row) => this.summary(row)) };
  }

  tags(): Promise<BlogTagCount[]> {
    return this.prisma.$queryRaw<BlogTagCount[]>(blogTagsSql(BLOG.tagsLimit));
  }

  private summary(post: BlogPostRow): BlogPostSummary {
    return toBlogPostSummary({ post, apiUrl: this.apiUrl() });
  }

  private apiUrl(): string {
    return this.config.get('API_URL');
  }
}
