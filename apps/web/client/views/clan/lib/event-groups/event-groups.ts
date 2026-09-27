import type { ClanMemberEvent } from '@otmetki/schemas';

import { dayKey, shiftDay, weekKey } from '@/shared/lib';

import type { EventDay, WeeklyMoves, WeeklyMovesInput } from './event-groups.types';

import { CLAN_EVENTS } from '../../config';

export const groupEventsByDay = (events: readonly ClanMemberEvent[]): EventDay[] => {
  const days: EventDay[] = [];

  [...events]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .forEach((event) => {
      const day = dayKey({ date: event.occurredAt });
      const last = days.at(-1);

      if (last?.day === day) {
        last.events.push(event);

        return;
      }

      days.push({ day, events: [event] });
    });

  return days;
};

export const weeklyMoves = ({ events, now, weeks }: WeeklyMovesInput): WeeklyMoves[] => {
  const today = dayKey({ date: now });
  const buckets = new Map<string, WeeklyMoves>(
    Array.from({ length: weeks }, (_, index) => {
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
