'use client';

import type { GameEventKind } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from 'nuqs';

import { eventsControllerCalendarOptions } from '@/shared/api/query-options';
import { safeWebHref } from '@/shared/lib';

import type { EventEntry } from '../../../lib/event-timeline';
import type { EventView, EventViewTimeline } from './use-event-calendar.types';

import { EVENTS } from '../../../config';
import { eventTimeline } from '../../../lib/event-timeline';

export const useEventCalendar = () => {
  const [kinds, setKinds] = useQueryState(
    'kinds',
    parseAsArrayOf(parseAsStringLiteral(EVENTS.kinds)).withDefault([]).withOptions({ history: 'replace' })
  );

  const { data, dataUpdatedAt, isPending, isError, isFetching, refetch } = useQuery({
    ...eventsControllerCalendarOptions(),
    staleTime: EVENTS.staleMs
  });

  const all = data ?? [];
  const events = kinds.length === 0 ? all : all.filter((event) => kinds.includes(event.kind));
  const grouped = eventTimeline({ events, now: new Date(dataUpdatedAt), openEndedDays: EVENTS.openEndedDays });
  const withHref = (entries: readonly EventEntry[]): EventView[] => entries.map((entry) => ({ ...entry, href: safeWebHref(entry.event.url) }));
  const timeline: EventViewTimeline = {
    current: withHref(grouped.current),
    upcoming: withHref(grouped.upcoming),
    past: withHref(grouped.past)
  };

  return {
    kinds,
    timeline,
    total: all.length,
    isFiltered: kinds.length > 0,
    isPending,
    isError,
    isRetrying: isFetching,
    setKinds: (next: GameEventKind[]) => void setKinds(next.length === 0 ? null : next),
    retry: () => void refetch()
  };
};
