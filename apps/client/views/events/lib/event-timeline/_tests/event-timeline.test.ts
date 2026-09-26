import type { GameEvent } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { eventEntry, eventTimeline } from '../event-timeline';

const now = new Date('2026-09-26T12:00:00Z');
const openEndedDays = 14;

const event = (slug: string, startsAt: string, endsAt: string | null): GameEvent => ({
  id: '00000000-0000-4000-8000-000000000000',
  slug,
  kind: 'event',
  title: slug,
  description: null,
  url: null,
  image: null,
  startsAt,
  endsAt
});

describe('eventEntry', () => {
  it('counts the days until an upcoming event starts', () => {
    expect(eventEntry({ event: event('a', '2026-09-30T12:00:00Z', null), now, openEndedDays })).toMatchObject({ phase: 'upcoming', days: 4 });
  });

  it('measures how far a running event has gone and the days left', () => {
    const entry = eventEntry({ event: event('a', '2026-09-24T12:00:00Z', '2026-09-30T12:00:00Z'), now, openEndedDays });

    expect(entry.phase).toBe('current');
    expect(entry.progress).toBeCloseTo(2 / 6);
    expect(entry.days).toBe(4);
  });

  it('keeps an event without an end current only for the grace window', () => {
    expect(eventEntry({ event: event('a', '2026-09-20T12:00:00Z', null), now, openEndedDays }).phase).toBe('current');
    expect(eventEntry({ event: event('a', '2026-09-01T12:00:00Z', null), now, openEndedDays }).phase).toBe('past');
  });

  it('treats an event ending exactly now as still running', () => {
    expect(eventEntry({ event: event('a', '2026-09-20T12:00:00Z', now.toISOString()), now, openEndedDays })).toMatchObject({
      phase: 'current',
      progress: 1,
      days: 0
    });
  });

  it('marks an ended event as past', () => {
    expect(eventEntry({ event: event('a', '2026-09-01T12:00:00Z', '2026-09-10T12:00:00Z'), now, openEndedDays }).phase).toBe('past');
  });
});

describe('eventTimeline', () => {
  it('orders running events by the nearest end, upcoming by start and past newest first', () => {
    const timeline = eventTimeline({
      events: [
        event('ends-late', '2026-09-20T00:00:00Z', '2026-10-20T00:00:00Z'),
        event('ends-soon', '2026-09-20T00:00:00Z', '2026-09-28T00:00:00Z'),
        event('open', '2026-09-25T00:00:00Z', null),
        event('next-month', '2026-10-20T00:00:00Z', null),
        event('next-week', '2026-10-02T00:00:00Z', null),
        event('old', '2026-08-01T00:00:00Z', '2026-08-10T00:00:00Z'),
        event('recent', '2026-09-01T00:00:00Z', '2026-09-15T00:00:00Z')
      ],
      now,
      openEndedDays
    });

    expect(timeline.current.map(({ event: item }) => item.slug)).toEqual(['ends-soon', 'ends-late', 'open']);
    expect(timeline.upcoming.map(({ event: item }) => item.slug)).toEqual(['next-week', 'next-month']);
    expect(timeline.past.map(({ event: item }) => item.slug)).toEqual(['recent', 'old']);
  });

  it('returns three empty groups for no events', () => {
    expect(eventTimeline({ events: [], now, openEndedDays })).toEqual({ current: [], upcoming: [], past: [] });
  });
});
