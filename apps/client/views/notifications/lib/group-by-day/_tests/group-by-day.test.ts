import type { InboxItem } from '@bronevik/schemas';

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
  item('a', '2026-09-25T18:00:00'),
  item('b', '2026-09-25T08:00:00', '2026-09-25T09:00:00'),
  item('c', '2026-09-24T21:00:00'),
  item('d', '2026-09-20T12:00:00')
];

describe('groupInboxByDay', () => {
  it('puts items of one local day into one group', () => {
    expect(groupInboxByDay(ITEMS).map(({ items }) => items.map(({ id }) => id))).toEqual([['a', 'b'], ['c'], ['d']]);
  });

  it('keeps the newest-first order of the feed', () => {
    const days = groupInboxByDay(ITEMS);

    days.slice(1).forEach((day, index) => expect(day.date.getTime()).toBeLessThan(days[index].date.getTime()));
  });

  it('loses no item', () => {
    expect(groupInboxByDay(ITEMS).flatMap(({ items }) => items)).toEqual(ITEMS);
  });

  it('counts the unread items of every day', () => {
    groupInboxByDay(ITEMS).forEach(({ items, unread }) => {
      expect(unread).toBe(items.filter(({ readAt }) => readAt === null).length);
    });
  });

  it('returns no groups for an empty feed', () => {
    expect(groupInboxByDay([])).toEqual([]);
  });
});
