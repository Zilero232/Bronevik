import type { ClanMemberEvent } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { groupEventsByDay, weeklyMoves } from '../event-groups';

const event = (occurredAt: string, type: ClanMemberEvent['type'] = 'joined'): ClanMemberEvent => ({
  accountId: 1,
  nickname: 'Tester',
  type,
  oldRole: null,
  newRole: null,
  occurredAt
});

const NOW = '2026-09-24T12:00:00';

const EVENTS = [
  event('2026-09-20T10:00:00', 'left'),
  event('2026-09-24T09:00:00'),
  event('2026-09-24T18:00:00', 'kicked'),
  event('2026-09-22T08:00:00', 'role_changed'),
  event('2026-06-01T08:00:00')
];

describe('groupEventsByDay', () => {
  it('puts the latest day first', () => {
    const days = groupEventsByDay(EVENTS).map(({ day }) => day);

    expect(days).toEqual([...days].sort().reverse());
  });

  it('collects events of one calendar day into a single group', () => {
    const [today] = groupEventsByDay(EVENTS);

    expect(today?.events).toHaveLength(2);
  });

  it('keeps every event after grouping', () => {
    expect(groupEventsByDay(EVENTS).flatMap(({ events }) => events)).toHaveLength(EVENTS.length);
  });

  it('returns nothing for an empty history', () => {
    expect(groupEventsByDay([])).toEqual([]);
  });
});

describe('weeklyMoves', () => {
  it('returns one bucket per requested week, oldest first', () => {
    const weeks = weeklyMoves({ events: EVENTS, now: NOW, weeks: 4 }).map(({ week }) => week);

    expect(weeks).toHaveLength(4);
    expect(weeks).toEqual([...weeks].sort());
  });

  it('counts kicks together with voluntary leaves', () => {
    const moves = weeklyMoves({ events: EVENTS, now: NOW, weeks: 4 });
    const current = moves.at(-1);

    expect(current).toMatchObject({ joined: 1, left: 1 });
  });

  it('ignores role changes', () => {
    const total = weeklyMoves({ events: [event('2026-09-22T08:00:00', 'role_changed')], now: NOW, weeks: 1 });

    expect(total[0]).toMatchObject({ joined: 0, left: 0 });
  });

  it('drops events older than the window', () => {
    const moves = weeklyMoves({ events: EVENTS, now: NOW, weeks: 4 });
    const counted = moves.reduce((sum, { joined, left }) => sum + joined + left, 0);

    expect(counted).toBe(EVENTS.filter(({ type, occurredAt }) => type !== 'role_changed' && occurredAt > '2026-08-31').length);
  });
});
