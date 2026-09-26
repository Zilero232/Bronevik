import type { ClanMemberEvent } from '@otmetki/schemas';

import { addWeeks, format, parseISO, startOfISOWeek } from 'date-fns';

import type { EventDay, WeeklyMoves, WeeklyMovesInput } from './event-groups.types';

const DATE_KEY = 'yyyy-MM-dd';

const dayOf = (iso: string) => format(parseISO(iso), DATE_KEY);

const weekOf = (date: Date) => format(startOfISOWeek(date), DATE_KEY);

export const groupEventsByDay = (events: readonly ClanMemberEvent[]): EventDay[] => {
  const days: EventDay[] = [];

  [...events]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .forEach((event) => {
      const day = dayOf(event.occurredAt);
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
  const end = parseISO(now);
  const buckets = new Map<string, WeeklyMoves>(
    Array.from({ length: weeks }, (_, index) => {
      const week = weekOf(addWeeks(end, index - weeks + 1));

      return [week, { week, joined: 0, left: 0 }];
    })
  );

  events.forEach(({ type, occurredAt }) => {
    const bucket = buckets.get(weekOf(parseISO(occurredAt)));

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
