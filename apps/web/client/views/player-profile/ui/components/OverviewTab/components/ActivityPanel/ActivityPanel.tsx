'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { CalendarHeatmap, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useActivity } from '../../../../../model/hooks';
import { ProfilePanel } from '../../../ProfilePanel';

export const ActivityPanel = () => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();
  const { days, total, active, winRateOf, query } = useActivity();

  return (
    <ProfilePanel meta={total > 0 ? t('activitySummary', { total, active }) : undefined} title={t('activityTitle')}>
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('activityEmpty')} />}
        isEmpty={() => total === 0}
        query={query}
        skeleton={<Skeleton height={OVERVIEW.heatmapSkeletonHeight} shape='block' />}
      >
        <CalendarHeatmap
          renderReadout={(day) =>
            day
              ? t('activityDay', {
                  date: format.dateTime(new Date(`${day.date}T00:00:00Z`), { day: 'numeric', month: 'long', timeZone: 'UTC' }),
                  battles: day.value,
                  winRate: format.number(winRateOf(day.date) ?? 0, { maximumFractionDigits: 1 })
                })
              : t('activityHint')
          }
          ariaLabel={t('activityAria', { total, active })}
          days={days}
          legend={{ less: t('less'), more: t('more') }}
        />
      </QueryState>
    </ProfilePanel>
  );
};
