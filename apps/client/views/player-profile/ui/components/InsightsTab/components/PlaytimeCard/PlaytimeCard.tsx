'use client';

import { useTranslations } from 'next-intl';

import { Badge, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { PLAYTIME } from '../../../../../config';
import { usePlaytimeCard } from '../../../../../model/hooks';
import { ProfilePanel } from '../../../ProfilePanel';
import { PlaytimeGrid } from '../PlaytimeGrid';

import s from './PlaytimeCard.module.scss';

export const PlaytimeCard = () => {
  const t = useTranslations('profile.insights.playtime');
  const { query, summary, isApproximate, weekday, shortWeekday, rate } = usePlaytimeCard();

  return (
    <ProfilePanel action={<Badge tone='steel'>{t('beta')}</Badge>} title={t('title')}>
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('empty')} />}
        isEmpty={({ source, battles }) => source === 'none' || battles === 0}
        query={query}
        skeleton={<Skeleton height={PLAYTIME.skeletonHeight} shape='block' />}
      >
        {({ cells }) => (
          <div className={s.root}>
            {isApproximate && <p className={s.note}>{t('approximate')}</p>}
            <ul className={s.callouts}>
              {summary?.bestHour && (
                <li data-kind='best'>
                  {t('bestHour', {
                    from: summary.bestHour.key,
                    to: (summary.bestHour.key + 1) % PLAYTIME.hours,
                    rate: rate(summary.bestHour.winRate)
                  })}
                </li>
              )}
              {summary?.worstHour && (
                <li data-kind='worst'>
                  {t('worstHour', {
                    from: summary.worstHour.key,
                    to: (summary.worstHour.key + 1) % PLAYTIME.hours,
                    rate: rate(summary.worstHour.winRate)
                  })}
                </li>
              )}
              {summary?.bestWeekday && (
                <li>{t('bestWeekday', { day: weekday(summary.bestWeekday.key), rate: rate(summary.bestWeekday.winRate) })}</li>
              )}
            </ul>
            <PlaytimeGrid cells={cells} weekdayLabel={shortWeekday} />
          </div>
        )}
      </QueryState>
    </ProfilePanel>
  );
};
