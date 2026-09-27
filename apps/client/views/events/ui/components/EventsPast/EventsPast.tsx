'use client';

import { useTranslations } from 'next-intl';

import { useEventCalendar } from '../../../model/hooks';
import { DropsPanel } from '../DropsPanel';
import { EventGroup } from '../EventGroup';

export const EventsPast = () => {
  const t = useTranslations('events');
  const { timeline, emptyKey } = useEventCalendar();

  return (
    <>
      <DropsPanel />
      <EventGroup emptyTitle={t(emptyKey('past'))} entries={timeline.past} title={t('groups.past')} />
    </>
  );
};
