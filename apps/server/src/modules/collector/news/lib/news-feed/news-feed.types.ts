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

export type PublishedAtInput = {
  item: FeedItem;
  now: Date;
};
