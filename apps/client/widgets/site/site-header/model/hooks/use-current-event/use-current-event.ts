'use client';

import { useQuery } from '@tanstack/react-query';

import { eventsControllerCalendarOptions } from '@/shared/api/query-options';
import { useClientNow } from '@/shared/lib';

import { NAV_MENU } from '../../../config';
import { currentEvent } from '../../../lib/current-event';

export const useCurrentEvent = () => {
  const now = useClientNow();
  const { data, isPending } = useQuery({ ...eventsControllerCalendarOptions(), staleTime: NAV_MENU.eventsStaleMs });

  return { event: now && data ? currentEvent({ events: data, now }) : null, isPending: isPending || !now };
};
