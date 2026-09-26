'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, ErrorState, PageHeader, Skeleton, ToggleChips } from '@/ui-kit';

import { EVENTS } from '../config';
import { useEventCalendar } from '../model/hooks';
import { EventGroup, IcsSubscribe } from './components';

import s from './EventsPage.module.scss';

export const EventsPage = () => {
  const t = useTranslations('events');
  const calendar = useEventCalendar();

  return (
    <div className={s.root}>
      <PageHeader aside={<IcsSubscribe />} description={t('head.description')} title={t('head.title')} />
      <ToggleChips
        aria-label={t('filters.label')}
        options={EVENTS.kinds.map((kind) => ({ value: kind, label: t(`kinds.${kind}`) }))}
        size='sm'
        value={calendar.kinds}
        onChange={calendar.setKinds}
      />
      {calendar.isError && (
        <ErrorState description={t('error.description')} isRetrying={calendar.isRetrying} title={t('error.title')} onRetry={calendar.retry} />
      )}
      {calendar.isPending && (
        <div className={s.groups}>
          {Array.from({ length: EVENTS.skeletons }, (_, index) => (
            <Skeleton key={index} height={160} shape='block' />
          ))}
        </div>
      )}
      {!calendar.isPending && !calendar.isError && (
        <div className={s.groups}>
          <EventGroup
            emptyTitle={t(calendar.isFiltered ? 'empty.filtered' : 'empty.current')}
            entries={calendar.timeline.current}
            title={t('groups.current')}
          />
          <EventGroup
            emptyTitle={t(calendar.isFiltered ? 'empty.filtered' : 'empty.upcoming')}
            entries={calendar.timeline.upcoming}
            title={t('groups.upcoming')}
          />
          <EventGroup
            emptyTitle={t(calendar.isFiltered ? 'empty.filtered' : 'empty.past')}
            entries={calendar.timeline.past}
            title={t('groups.past')}
          />
        </div>
      )}
      <DataSourceNote />
    </div>
  );
};
