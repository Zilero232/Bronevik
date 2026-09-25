import { z } from 'zod';

import type { NewsKind, Prisma } from '../../../../../../generated';
import type { FeedItem, PublishedAtInput, ToNewsItemsInput } from './news-feed.types';

import { NEWS_FEED } from './news-feed.constants';

const categorySchema = z.object({ _: z.string() });

const categoryText = (category: unknown): string => {
  if (typeof category === 'string') {
    return category;
  }

  const parsed = categorySchema.safeParse(category);

  return parsed.success ? parsed.data._ : '';
};

export const newsKind = (item: FeedItem): NewsKind => {
  const haystack = [item.title ?? '', ...(item.categories ?? []).map(categoryText)].join(' ');

  if (NEWS_FEED.patchNotes.test(haystack)) {
    return 'patchNotes';
  }

  return NEWS_FEED.devBlog.test(haystack) ? 'devBlog' : 'news';
};

const publishedAt = ({ item, now }: PublishedAtInput): Date => {
  const parsed = new Date(item.isoDate ?? item.pubDate ?? '');

  return Number.isNaN(parsed.getTime()) ? now : parsed;
};

export const toNewsItems = ({ items, now }: ToNewsItemsInput): Prisma.NewsItemCreateManyInput[] =>
  items.flatMap((item) => {
    if (!item.link || !item.title) {
      return [];
    }

    return [
      {
        source: NEWS_FEED.source,
        externalId: item.guid ?? null,
        url: item.link,
        kind: newsKind(item),
        title: item.title.trim(),
        summary: item.contentSnippet?.trim().slice(0, NEWS_FEED.summaryLength) || null,
        image: item.enclosure?.url ?? null,
        publishedAt: publishedAt({ item, now })
      }
    ];
  });
