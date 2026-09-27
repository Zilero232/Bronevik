import { groupBy, unique } from 'remeda';

import { dayKey } from '@/shared/lib';

import type { SocialFeedItem } from '../../api';
import type { FeedDay, FeedSummary, FilterFeedInput, GroupFeedInput } from './feed-groups.types';

export const filterFeed = ({ items, kind }: FilterFeedInput): SocialFeedItem[] =>
  kind === 'all' ? [...items] : items.filter((item) => item.kind === kind);

export const groupFeedByDay = ({ items, timeZone }: GroupFeedInput): FeedDay[] => {
  const byDay = groupBy(items, (item) => dayKey({ date: item.at, timeZone }));

  return unique(items.map((item) => dayKey({ date: item.at, timeZone }))).map((day) => ({ day, items: byDay[day] ?? [] }));
};

export const feedSummary = (items: readonly SocialFeedItem[]): FeedSummary => ({
  players: unique(items.map((item) => item.accountId)).length,
  marks: items.filter((item) => item.kind === 'mark').length,
  masteries: items.filter((item) => item.kind === 'mastery').length,
  records: items.filter((item) => item.kind === 'record').length,
  badges: items.filter((item) => item.kind === 'badge').length
});

export const feedItemKey = (item: SocialFeedItem): string => `${item.kind}-${item.accountId}-${item.tankId ?? item.badge?.code ?? 'none'}-${item.at}`;

export const feedGain = ({ value, previous }: Pick<SocialFeedItem, 'previous' | 'value'>): number | null =>
  previous === null ? null : value - previous;
