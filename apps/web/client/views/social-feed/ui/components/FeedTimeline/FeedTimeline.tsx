'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Timeline } from '@/ui-kit';

import type { FeedTimelineProps } from './FeedTimeline.types';

import { FEED_KIND_TONES, FEED_VIEW } from '../../../config';
import { feedItemKey } from '../../../lib/feed-groups';
import { FeedEntry } from './components';

import s from './FeedTimeline.module.scss';

export const FeedTimeline = ({ days, vehicles }: FeedTimelineProps) => {
  const t = useTranslations('social.feed');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {days.map(({ day, items }) => (
        <section key={day} className={s.day}>
          <h2 className={s.heading}>{format.dateTime(new Date(day), FEED_VIEW.dayHeading)}</h2>
          <Timeline
            items={items.map((item) => ({
              id: feedItemKey(item),
              tone: FEED_KIND_TONES[item.kind],
              date: format.dateTime(new Date(item.at), 'time'),
              dateTime: item.at,
              content: <FeedEntry item={item} vehicle={item.tankId === null ? null : (vehicles[item.tankId] ?? null)} />
            }))}
            aria-label={t('timeline')}
            variant='card'
          />
        </section>
      ))}
    </div>
  );
};
