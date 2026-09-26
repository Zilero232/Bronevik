import type { InboxItem, InboxPage } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { readInboxPage } from '../read-inbox-page';

const READ_AT = '2026-09-25T10:00:00.000Z';

const item = (id: string, readAt: string | null): InboxItem => ({
  id,
  event: 'moe_gained',
  title: id,
  body: id,
  url: null,
  createdAt: '2026-09-24T10:00:00.000Z',
  readAt
});

const PAGE: InboxPage = {
  items: [item('a', null), item('b', null), item('c', '2026-09-20T10:00:00.000Z')],
  unread: 5
};

describe('readInboxPage', () => {
  it('marks only the targeted unread items and lowers the count by their number', () => {
    const next = readInboxPage({ page: PAGE, ids: ['a'], readAt: READ_AT });

    expect(next.items.map(({ readAt }) => readAt)).toEqual([READ_AT, null, PAGE.items[2].readAt]);
    expect(next.unread).toBe(PAGE.unread - 1);
  });

  it('marks everything and zeroes the count when no ids are given', () => {
    const next = readInboxPage({ page: PAGE, readAt: READ_AT });

    expect(next.items.every(({ readAt }) => readAt !== null)).toBe(true);
    expect(next.unread).toBe(0);
  });

  it('keeps the read time of an item that was already read', () => {
    const next = readInboxPage({ page: PAGE, ids: ['c'], readAt: READ_AT });

    expect(next.items[2].readAt).toBe(PAGE.items[2].readAt);
  });

  it('never drops the count below zero', () => {
    const next = readInboxPage({ page: { ...PAGE, unread: 1 }, ids: ['a', 'b'], readAt: READ_AT });

    expect(next.unread).toBe(0);
  });

  it('counts a repeated id once', () => {
    const next = readInboxPage({ page: PAGE, ids: ['a', 'a'], readAt: READ_AT });

    expect(next.unread).toBe(PAGE.unread - 1);
  });

  it('leaves the source page untouched', () => {
    readInboxPage({ page: PAGE, readAt: READ_AT });

    expect(PAGE.items[0].readAt).toBeNull();
  });
});
