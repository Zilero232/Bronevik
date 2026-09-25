export type FeedItem = {
  title?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  categories?: unknown[];
  enclosure?: { url?: string };
};

export type ToNewsItemsInput = {
  items: readonly FeedItem[];
  now: Date;
};

export type PublishedAtInput = {
  item: FeedItem;
  now: Date;
};
