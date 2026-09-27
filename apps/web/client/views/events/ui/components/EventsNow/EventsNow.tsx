'use client';

import { useTranslations } from 'next-intl';

import { Band, EmptyState, SectionHeader } from '@/ui-kit';

import { useEventCalendar } from '../../../model/hooks';
import { EventGroup } from '../EventGroup';
import { NowCard } from '../NowCard';

import s from './EventsNow.module.scss';

export const EventsNow = () => {
  const t = useTranslations('events');
  const { timeline, featured, emptyKey } = useEventCalendar();

  return (
    <Band innerClassName={s.inner}>
      <SectionHeader count={timeline.current.length} title={t('groups.current')} variant='display' />
      {featured.length === 0 ? (
        <EmptyState isCompact title={t(emptyKey('current'))} />
      ) : (
        <div className={s.grid}>
          {featured.map((entry) => (
            <NowCard key={entry.event.id} entry={entry} />
          ))}
        </div>
      )}
      {timeline.current.length > featured.length && (
        <EventGroup emptyTitle={t(emptyKey('current'))} entries={timeline.current.slice(featured.length)} title={t('groups.alsoRunning')} />
      )}
    </Band>
  );
};
