import { describe, expect, it } from 'vitest';

import type { SocialFeedItem } from '../../../api';

import { feedGain, feedItemKey, feedSummary, filterFeed, groupFeedByDay } from '../feed-groups';

const item = (overrides: Partial<SocialFeedItem>): SocialFeedItem => ({
  kind: 'mark',
  accountId: 1,
  nickname: 'Tester',
  tankId: 1,
  value: 2,
  previous: 1,
  badge: null,
  at: '2026-09-20T12:00:00Z',
  ...overrides
});

const ITEMS = [
  item({ kind: 'record', accountId: 1, at: '2026-09-21T18:00:00Z', value: 6_000, previous: 5_200 }),
  item({ kind: 'mark', accountId: 2, at: '2026-09-21T09:00:00Z' }),
  item({
    kind: 'badge',
    accountId: 2,
    at: '2026-09-20T22:30:00Z',
    badge: { code: 'weekly-battles-50', challenge: { code: 'battles-50', metric: 'battles', target: 50, threshold: null, vehicleType: null } },
    previous: null,
    value: 1,
    tankId: null
  }),
  item({ kind: 'mastery', accountId: 3, at: '2026-09-19T10:00:00Z', value: 4, previous: 3 })
];

describe('filterFeed', () => {
  it('keeps everything for the all filter', () => {
    expect(filterFeed({ items: ITEMS, kind: 'all' })).toHaveLength(4);
  });

  it('keeps one kind', () => {
    expect(filterFeed({ items: ITEMS, kind: 'mark' }).map(({ accountId }) => accountId)).toEqual([2]);
  });
});

describe('groupFeedByDay', () => {
  it('groups by the local day and keeps the order', () => {
    const days = groupFeedByDay({ items: ITEMS, timeZone: 'Europe/Moscow' });

    expect(days.map(({ day, items }) => [day, items.length])).toEqual([
      ['2026-09-21', 3],
      ['2026-09-19', 1]
    ]);
  });

  it('uses the given time zone for the day boundary', () => {
    expect(groupFeedByDay({ items: ITEMS.slice(2, 3), timeZone: 'UTC' })[0]?.day).toBe('2026-09-20');
  });
});

describe('feedSummary', () => {
  it('counts every kind and the distinct players', () => {
    expect(feedSummary(ITEMS)).toEqual({ players: 3, marks: 1, masteries: 1, records: 1, badges: 1 });
  });
});

describe('feedItemKey', () => {
  it('keeps two badges of one player at the same moment apart', () => {
    const at = '2026-09-22T10:00:00Z';
    const badge = (code: string) => item({ kind: 'badge', tankId: null, at, badge: { code, challenge: null } });

    expect(feedItemKey(badge('weekly-wins-25'))).not.toBe(feedItemKey(badge('weekly-battles-50')));
  });
});

describe('feedGain', () => {
  it('returns the signed gain or null without a previous value', () => {
    expect(feedGain({ value: 6_000, previous: 5_200 })).toBe(800);
    expect(feedGain({ value: 1, previous: null })).toBeNull();
  });
});
