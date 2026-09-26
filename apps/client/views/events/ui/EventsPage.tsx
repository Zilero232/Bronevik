'use client';

import { CalendarDays, CalendarPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import {
  Band,
  buttonVariants,
  CopyField,
  DataSourceNote,
  EmptyState,
  ErrorState,
  KeyFigure,
  PageHero,
  SectionHeader,
  Skeleton,
  ToggleChips
} from '@/ui-kit';

import { EVENTS_FEED } from '../api';
import { EVENTS } from '../config';
import { useEventCalendar } from '../model/hooks';
import { DropsPanel, EventGroup, EventTimeline, NowCard } from './components';

import s from './EventsPage.module.scss';

export const EventsPage = () => {
  const t = useTranslations('events');
  const calendar = useEventCalendar();
  const emptyKey = calendar.isFiltered ? 'empty.filtered' : null;

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <CalendarDays size={480} strokeWidth={1.25} /> }}
        breadcrumbs={[{ label: t('head.home'), href: ROUTES.home }, { label: t('head.title') }]}
        figures={calendar.featured[0] && <KeyFigure label={t('head.nowFigure')} value={calendar.featured[0].event.title} variant='compact' />}
        lead={t('head.description')}
        title={t('head.title')}
      />
      <div className={s.strip} data-theme='dark'>
        <div className={s.stripInner}>
          <ToggleChips
            aria-label={t('filters.label')}
            options={EVENTS.kinds.map((kind) => ({ value: kind, label: t(`kinds.${kind}`) }))}
            size='sm'
            value={calendar.kinds}
            onChange={calendar.setKinds}
          />
          <div className={s.stripActions}>
            <CopyField className={s.feed} label={t('ics.url')} value={EVENTS_FEED.ics} />
            <a className={buttonVariants({ variant: 'primary' })} href={EVENTS_FEED.webcal}>
              <CalendarPlus aria-hidden size={16} />
              {t('ics.subscribeIcs')}
            </a>
          </div>
        </div>
      </div>
      {calendar.isError && (
        <div className={s.section}>
          <ErrorState description={t('error.description')} isRetrying={calendar.isRetrying} title={t('error.title')} onRetry={calendar.retry} />
        </div>
      )}
      {calendar.isPending && (
        <div className={s.section}>
          {Array.from({ length: EVENTS.skeletons }, (_, index) => (
            <Skeleton key={index} height={160} shape='block' />
          ))}
        </div>
      )}
      {!calendar.isPending && !calendar.isError && (
        <>
          <Band innerClassName={s.bandInner}>
            <SectionHeader count={calendar.timeline.current.length} title={t('groups.current')} variant='display' />
            {calendar.featured.length === 0 ? (
              <EmptyState isCompact title={t(emptyKey ?? 'empty.current')} />
            ) : (
              <div className={s.nowGrid}>
                {calendar.featured.map((entry) => (
                  <NowCard key={entry.event.id} entry={entry} />
                ))}
              </div>
            )}
            {calendar.timeline.current.length > calendar.featured.length && (
              <EventGroup
                emptyTitle={t(emptyKey ?? 'empty.current')}
                entries={calendar.timeline.current.slice(calendar.featured.length)}
                title={t('groups.alsoRunning')}
              />
            )}
          </Band>
          <section className={s.section}>
            <SectionHeader count={calendar.timeline.upcoming.length} title={t('groups.upcoming')} variant='display' />
            <EventTimeline emptyTitle={t(emptyKey ?? 'empty.upcoming')} weeks={calendar.upcomingWeeks} />
          </section>
          <section className={s.section}>
            <DropsPanel />
            <EventGroup emptyTitle={t(emptyKey ?? 'empty.past')} entries={calendar.timeline.past} title={t('groups.past')} />
          </section>
        </>
      )}
      <div className={s.section}>
        <DataSourceNote />
      </div>
    </div>
  );
};
