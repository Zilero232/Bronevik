'use client';

import { RadioTower } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AnimatedNumber, PageHero, Skeleton } from '@/ui-kit';

import { useInboxFeedQuery } from '../../../model/hooks';

import s from './NotificationsHero.module.scss';

const SIGNAL_BARS = 5;

export const NotificationsHero = () => {
  const t = useTranslations('notifications.hero');
  const { data, isError } = useInboxFeedQuery();

  const unread = data?.pages[0]?.unread;
  const isLive = (unread ?? 0) > 0;

  return (
    <PageHero
      aside={
        <div className={s.signal} data-live={isLive}>
          <span aria-hidden className={s.bars}>
            {Array.from({ length: SIGNAL_BARS }, (_, index) => (
              <span key={index} className={s.bar} />
            ))}
          </span>
          <span className={s.readout}>
            <span className={s.value}>
              {unread !== undefined && <AnimatedNumber value={unread} />}
              {unread === undefined && (isError ? '—' : <Skeleton width={56} />)}
            </span>
            <span className={s.label}>{t('unread')}</span>
          </span>
          <span className={s.hint}>{isLive ? t('unreadHint') : t('quietHint')}</span>
        </div>
      }
      description={t('description')}
      eyebrow={t('eyebrow')}
      index='// 02'
      title={t('title')}
      watermark={<RadioTower size={220} strokeWidth={0.5} />}
    />
  );
};
