import type { ClanMemberEvent } from '@otmetki/schemas';

import { entries, groupBy, map, pipe, sortBy, times } from 'remeda';

import { dayKey, shiftDay, weekKey } from '@/shared/lib';

import type { EventDay, WeeklyMoves, WeeklyMovesInput } from './event-groups.types';

import { CLAN_EVENTS } from '../../config';

export const groupEventsByDay = (events: readonly ClanMemberEvent[]): EventDay[] =>
  pipe(
    events,
    sortBy([({ occurredAt }) => occurredAt, 'desc']),
    groupBy(({ occurredAt }) => dayKey({ date: occurredAt })),
    entries(),
    map(([day, dayEvents]) => ({ day, events: dayEvents }))
  );

export const weeklyMoves = ({ events, now, weeks }: WeeklyMovesInput): WeeklyMoves[] => {
  const today = dayKey({ date: now });
  const buckets = new Map<string, WeeklyMoves>(
    times(weeks, (index) => {
      const week = weekKey({ date: shiftDay({ day: today, amount: (index - weeks + 1) * CLAN_EVENTS.daysPerWeek }) });

      return [week, { week, joined: 0, left: 0 }];
    })
  );

  events.forEach(({ type, occurredAt }) => {
    const bucket = buckets.get(weekKey({ date: occurredAt }));

    if (!bucket) {
      return;
    }

    if (type === 'joined') {
      bucket.joined += 1;
    }

    if (type === 'left' || type === 'kicked') {
      bucket.left += 1;
    }
  });

  return [...buckets.values()];
};
