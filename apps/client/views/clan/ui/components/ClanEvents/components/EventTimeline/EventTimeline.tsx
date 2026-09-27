'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { EventTimelineProps } from './EventTimeline.types';

import { CLAN_EVENTS } from '../../../../../config';
import { useClanEvents } from '../../../../../model/hooks';
import { EventItem } from '../EventItem';

import s from './EventTimeline.module.scss';

export const EventTimeline = ({ clanId }: EventTimelineProps) => {
  const t = useTranslations('clans.events');
  const format = useFormatter();
  const { days, shown, total, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, loadMore, retry } = useClanEvents(clanId);

  return (
    <Card padding='none'>
      <CardHeader meta={total > 0 && t('shown', { shown, total })} title={t('title')} />
      {match({ isPending, isError, count: days.length })
        .with({ isPending: true }, () => (
          <div aria-busy aria-label={t('loading')} className={s.body} role='status'>
            <Skeleton count={CLAN_EVENTS.skeletonRows} height={28} />
          </div>
        ))
        .with({ isError: true, count: 0 }, () => <ErrorState isCompact isRetrying={isRetrying} title={t('error')} onRetry={retry} />)
        .with({ count: 0 }, () => <EmptyState isCompact title={t('emptyTitle')} />)
        .otherwise(() => (
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
            {hasNextPage && (
              <Button className={s.more} disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
                {t('more')}
              </Button>
            )}
          </div>
        ))}
    </Card>
  );
};
