'use client';

import { useQuery } from '@tanstack/react-query';

import { eventsControllerDropsOptions } from '@/shared/api/query-options';
import { safeWebHref } from '@/shared/lib';

import type { EventView } from '../use-event-calendar';

import { EVENTS } from '../../../config';
import { eventTimeline } from '../../../lib/event-timeline';

export const useActiveDrops = () => {
  const query = useQuery({
    ...eventsControllerDropsOptions(),
    staleTime: EVENTS.staleMs
  });

  const grouped = eventTimeline({ events: query.data ?? [], now: new Date(query.dataUpdatedAt), openEndedDays: EVENTS.openEndedDays });
  const entries: EventView[] = [...grouped.current, ...grouped.upcoming].map((entry) => ({ ...entry, href: safeWebHref(entry.event.url) }));

  return { query, entries };
};
