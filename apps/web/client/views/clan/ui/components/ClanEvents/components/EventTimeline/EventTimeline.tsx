'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Button, Card, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { EventTimelineProps } from './EventTimeline.types';

import { CLAN_EVENTS } from '../../../../../config';
import { useClanEvents } from '../../../../../model/hooks';
import { EventItem } from '../EventItem';

import s from './EventTimeline.module.scss';

export const EventTimeline = ({ clanId }: EventTimelineProps) => {
  const t = useTranslations('clans.events');
  const format = useFormatter();
  const query = useClanEvents(clanId);

  return (
    <Card padding='none'>
      <CardHeader meta={query.data && query.data.total > 0 && t('shown', { shown: query.data.shown, total: query.data.total })} title={t('title')} />
      <QueryState
        isCompact
        skeleton={
          <div aria-busy aria-label={t('loading')} className={s.body} role='status'>
            <Skeleton count={CLAN_EVENTS.skeletonRows} height={28} />
          </div>
        }
        empty={<EmptyState isCompact title={t('emptyTitle')} />}
        errorTitle={t('error')}
        isEmpty={({ days }) => days.length === 0}
        query={query}
      >
        {({ days }) => (
          <div className={s.body}>
            <ol className={s.days}>
              {days.map(({ day, events }) => (
                <li key={day} className={s.day}>
                  <h3 className={s.date}>
                    <time dateTime={day}>{format.dateTime(new Date(`${day}T12:00:00`), { weekday: 'short', day: 'numeric', month: 'long' })}</time>
                    <span className={s.dayCount}>{t('dayCount', { count: events.length })}</span>
                  </h3>
                  <ul className={s.events}>
                    {events.map((event) => (
                      <EventItem key={`${event.accountId}-${event.occurredAt}-${event.type}`} event={event} />
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            {query.hasNextPage && (
              <Button className={s.more} disabled={query.isFetchingNextPage} size='sm' variant='secondary' onClick={() => void query.fetchNextPage()}>
                {t('more')}
              </Button>
            )}
          </div>
        )}
      </QueryState>
    </Card>
  );
};
