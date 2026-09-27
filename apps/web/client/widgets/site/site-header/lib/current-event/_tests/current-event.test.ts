import type { GameEvent } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { currentEvent } from '../current-event';

const event = (id: string, startsAt: string, endsAt: string | null): GameEvent => ({
  id,
  slug: id,
  kind: 'event',
  title: id,
  description: null,
  url: null,
  image: null,
  startsAt,
  endsAt
});

const now = new Date('2026-09-26T12:00:00Z');

describe('currentEvent', () => {
  it('picks the running event that ends first', () => {
    const events = [
      event('long', '2026-09-01T00:00:00Z', '2026-10-30T00:00:00Z'),
      event('short', '2026-09-20T00:00:00Z', '2026-09-28T00:00:00Z'),
      event('open', '2026-09-10T00:00:00Z', null)
    ];

    expect(currentEvent({ events, now })?.id).toBe('short');
  });

  it('skips upcoming and finished events', () => {
    const events = [event('past', '2026-09-01T00:00:00Z', '2026-09-10T00:00:00Z'), event('next', '2026-10-01T00:00:00Z', null)];

    expect(currentEvent({ events, now })).toBeNull();
  });

  it('treats an open-ended event as running', () => {
    expect(currentEvent({ events: [event('open', '2026-09-10T00:00:00Z', null)], now })?.id).toBe('open');
  });
});
