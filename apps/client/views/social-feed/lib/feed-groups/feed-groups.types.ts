import type { SocialFeedItem } from '../../api';
import type { FEED_DAYS, FEED_FILTERS } from '../../config';

export type FeedFilter = (typeof FEED_FILTERS)[number];

export type FeedDays = (typeof FEED_DAYS)[number];

export type FilterFeedInput = {
  items: readonly SocialFeedItem[];
  kind: FeedFilter;
};

export type GroupFeedInput = {
  items: readonly SocialFeedItem[];
  timeZone?: string;
};

export type FeedDay = {
  day: string;
  items: SocialFeedItem[];
};

export type FeedSummary = {
  players: number;
  marks: number;
  masteries: number;
  records: number;
  badges: number;
};
