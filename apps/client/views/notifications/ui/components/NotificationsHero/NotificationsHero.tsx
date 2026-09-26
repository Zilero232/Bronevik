'use client';

import { useTranslations } from 'next-intl';

import { AnimatedNumber, PageHeader, Skeleton } from '@/ui-kit';

import { useNotificationsHero } from '../../../model/hooks';

import s from './NotificationsHero.module.scss';

export const NotificationsHero = () => {
  const t = useTranslations('notifications.hero');
  const { unread, isLive, isError, bars } = useNotificationsHero();

  return (
    <PageHeader
      aside={
        <div className={s.signal} data-live={isLive}>
          <span aria-hidden className={s.bars}>
            {bars.map((bar) => (
              <span key={bar} className={s.bar} />
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
      title={t('title')}
    />
  );
};
