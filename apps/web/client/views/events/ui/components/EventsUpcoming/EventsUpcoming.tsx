'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { useEventCalendar } from '../../../model/hooks';
import { EventTimeline } from '../EventTimeline';

export const EventsUpcoming = () => {
  const t = useTranslations('events');
  const { timeline, upcomingWeeks, emptyKey } = useEventCalendar();

  return (
    <>
      <SectionHeader count={timeline.upcoming.length} title={t('groups.upcoming')} variant='display' />
      <EventTimeline emptyTitle={t(emptyKey('upcoming'))} weeks={upcomingWeeks} />
    </>
  );
};
