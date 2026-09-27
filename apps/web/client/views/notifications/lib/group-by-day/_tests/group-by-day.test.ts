import type { InboxItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { groupInboxByDay } from '..';

const item = (id: string, createdAt: string, readAt: string | null = null): InboxItem => ({
  id,
  event: 'session_finished',
  title: id,
  body: id,
  url: null,
  createdAt,
  readAt
});

const ITEMS = [
  item('a', '2026-09-25T15:00:00Z'),
  item('b', '2026-09-25T05:00:00Z', '2026-09-25T06:00:00Z'),
  item('c', '2026-09-24T18:00:00Z'),
  item('d', '2026-09-20T09:00:00Z')
];

const ids = (items: InboxItem[]) => groupInboxByDay(items).map((day) => day.items.map(({ id }) => id));

describe('groupInboxByDay', () => {
  it('puts items of one calendar day into one group', () => {
    expect(ids(ITEMS)).toEqual([['a', 'b'], ['c'], ['d']]);
  });

  it('keys each group by its Moscow calendar day', () => {
    expect(groupInboxByDay(ITEMS).map(({ key }) => key)).toEqual(['2026-09-25', '2026-09-24', '2026-09-20']);
  });

  it('splits the day at Moscow midnight rather than UTC midnight', () => {
    const late = [item('after', '2026-09-24T21:30:00Z'), item('before', '2026-09-24T20:30:00Z'), item('utc-same', '2026-09-24T01:00:00Z')];

    expect(ids(late)).toEqual([['after'], ['before', 'utc-same']]);
    expect(groupInboxByDay(late)[0]?.key).toBe('2026-09-25');
  });

  it('keeps the newest-first order of the feed', () => {
    const days = groupInboxByDay(ITEMS);

    days.slice(1).forEach((day, index) => expect(day.date.getTime()).toBeLessThan(days[index].date.getTime()));
  });

  it('loses no item', () => {
    expect(groupInboxByDay(ITEMS).flatMap(({ items }) => items)).toEqual(ITEMS);
  });

  it('counts the unread items of every day', () => {
    expect(groupInboxByDay(ITEMS).map(({ unread }) => unread)).toEqual([1, 1, 1]);
  });

  it('returns no groups for an empty feed', () => {
    expect(groupInboxByDay([])).toEqual([]);
  });
});
