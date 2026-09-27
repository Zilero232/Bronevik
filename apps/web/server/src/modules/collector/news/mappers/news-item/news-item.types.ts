import type { FeedItem } from '../../lib/news-feed';

export type ToNewsItemsInput = {
  items: readonly FeedItem[];
  now: Date;
};
