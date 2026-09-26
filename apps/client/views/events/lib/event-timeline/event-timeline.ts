import { addDays, differenceInCalendarDays } from 'date-fns';
import { sortBy } from 'remeda';

import type { EventEntry, EventEntryInput, EventTimeline, EventTimelineInput } from './event-timeline.types';

export const eventEntry = ({ event, now, openEndedDays }: EventEntryInput): EventEntry => {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;

  if (start.getTime() > now.getTime()) {
    return { event, phase: 'upcoming', progress: null, days: differenceInCalendarDays(start, now) };
  }

  if (end === null) {
    const isFresh = addDays(start, openEndedDays).getTime() >= now.getTime();

    return { event, phase: isFresh ? 'current' : 'past', progress: null, days: null };
  }

  if (end.getTime() < now.getTime()) {
    return { event, phase: 'past', progress: null, days: null };
  }

  const span = end.getTime() - start.getTime();
  const progress = span > 0 ? (now.getTime() - start.getTime()) / span : 1;

  return { event, phase: 'current', progress, days: differenceInCalendarDays(end, now) };
};

export const eventTimeline = ({ events, now, openEndedDays }: EventTimelineInput): EventTimeline => {
  const entries = events.map((event) => eventEntry({ event, now, openEndedDays }));
  const endOrStart = ({ event }: EventEntry) => event.endsAt ?? event.startsAt;

  return {
    current: sortBy(
      entries.filter((entry) => entry.phase === 'current'),
      [(entry) => entry.days ?? Number.POSITIVE_INFINITY, 'asc']
    ),
    upcoming: sortBy(
      entries.filter((entry) => entry.phase === 'upcoming'),
      [(entry) => entry.event.startsAt, 'asc']
    ),
    past: sortBy(
      entries.filter((entry) => entry.phase === 'past'),
      [endOrStart, 'desc']
    )
  };
};
