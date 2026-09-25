'use client';

import { History, LoaderCircle, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { Button, EmptyState, Skeleton } from '@/ui-kit';

import type { EventTimelineProps } from './EventTimeline.types';

import { useClanEvents } from '../../../../../model/hooks';
import { EventItem } from '../EventItem';

import s from './EventTimeline.module.scss';

const SKELETON_ROWS = 6;

export const EventTimeline = ({ clanId }: EventTimelineProps) => {
  const t = useTranslations('clans.events');
  const format = useFormatter();
  const { days, shown, total, isPending, isError, hasNextPage, isFetchingNextPage, loadMore, retry } = useClanEvents(clanId);

  return match({ isPending, isError, count: days.length })
    .with({ isPending: true }, () => (
      <div aria-busy aria-label={t('loading')} className={s.skeleton} role='status'>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} height={48} shape='block' />
        ))}
      </div>
    ))
    .with({ isError: true, count: 0 }, () => (
      <EmptyState
        action={
          <Button variant='secondary' onClick={retry}>
            <RotateCcw size={16} />
            {t('retry')}
          </Button>
        }
        code='ERR'
        title={t('error')}
      />
    ))
    .with({ count: 0 }, () => <EmptyState description={t('emptyDescription')} icon={<History size={28} />} title={t('emptyTitle')} />)
    .otherwise(() => (
      <div className={s.root}>
        <motion.ol animate='visible' className={s.days} initial='hidden' variants={STAGGER}>
          {days.map(({ day, events }) => (
            <motion.li key={day} className={s.day} variants={STAGGER_ITEM}>
              <h3 className={s.date}>
                <time dateTime={day}>{format.dateTime(new Date(`${day}T12:00:00`), { weekday: 'short', day: 'numeric', month: 'long' })}</time>
                <span className={s.dayCount}>{t('dayCount', { count: events.length })}</span>
              </h3>
              <ul className={s.events}>
                {events.map((event) => (
                  <EventItem key={`${event.accountId}-${event.occurredAt}-${event.type}`} event={event} />
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ol>
        <div className={s.footer}>
          <span className={s.progress}>{t('shown', { shown, total })}</span>
          {hasNextPage && (
            <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
              {isFetchingNextPage && <LoaderCircle className={s.spinner} size={14} />}
              {t('more')}
            </Button>
          )}
        </div>
      </div>
    ));
};
