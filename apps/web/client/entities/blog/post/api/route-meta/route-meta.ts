import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { lookupRouteMeta } from '@/shared/seo/server';

import type { BlogRouteMeta, BlogSitemapItem } from './route-meta.types';

import { getBlogArticle, listBlogPosts } from '../posts';

export const blogRouteMeta = async (slug: string): Promise<BlogRouteMeta | null> => {
  'use cache';

  return lookupRouteMeta(async () => {
    const { post } = await getBlogArticle({ slug });

    return {
      title: post.title,
      cover: post.cover,
      excerpt: post.excerpt,
      seoTitle: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      authorName: post.author?.name ?? null,
      contentLocale: post.locale
    };
  });
};

export const blogSitemapItems = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput): Promise<BlogSitemapItem[]> => {
  'use cache';

  try {
    const { items } = await listBlogPosts({ limit });

    return items.map(({ slug, locale }) => ({ slug, locale }));
  } catch {
    return [];
  }
};
