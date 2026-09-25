'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { sumBy } from 'remeda';

import { CalendarHeatmap, Skeleton } from '@/ui-kit';

import { usePlayerActivity } from '../../../../../model/hooks';
import { TabCard } from '../../../TabCard';
import { TabState } from '../../../TabState';

export const ActivityCard = () => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();
  const { data: activity, isPending, isError } = usePlayerActivity();

  const days = activity?.days.map(({ date, battles }) => ({ date, value: battles })) ?? [];
  const winRates = new Map(activity?.days.map(({ date, winRate }) => [date, winRate]));
  const total = sumBy(days, ({ value }) => value);
  const active = days.filter(({ value }) => value > 0).length;

  return (
    <TabCard action={<span>{t('activitySummary', { total, active })}</span>} eyebrow={t('activityEyebrow')} title={t('activityTitle')}>
      {isPending && <Skeleton height={140} shape='block' />}
      {isError && <TabState kind='error' />}
      {activity && total === 0 && <TabState kind='empty' />}
      {activity && total > 0 && (
        <CalendarHeatmap
          renderReadout={(day) =>
            day
              ? t('activityDay', {
                  date: format.dateTime(new Date(`${day.date}T00:00:00Z`), { day: 'numeric', month: 'long', timeZone: 'UTC' }),
                  battles: day.value,
                  winRate: format.number(winRates.get(day.date) ?? 0, { maximumFractionDigits: 1 })
                })
              : t('activityHint')
          }
          ariaLabel={t('activityAria', { total, active })}
          days={days}
          legend={{ less: t('less'), more: t('more') }}
        />
      )}
    </TabCard>
  );
};
