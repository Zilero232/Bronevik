'use client';

import { useQuery } from '@tanstack/react-query';

import { calendarQueries } from '@/entities/event/calendar';
import { useClientNow } from '@/shared/lib';

import { NAV_MENU } from '../../../config';
import { currentEvent } from '../../../lib/current-event';

export const useCurrentEvent = () => {
  const now = useClientNow();
  const { data, isPending } = useQuery({ ...calendarQueries.all(), staleTime: NAV_MENU.eventsStaleMs });

  return { event: now && data ? currentEvent({ events: data, now }) : null, isPending: isPending || !now };
};
