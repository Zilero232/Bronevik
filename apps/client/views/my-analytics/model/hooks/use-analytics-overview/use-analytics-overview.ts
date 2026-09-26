'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { getAnalyticsOverview } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';
import { percentText, ratingTone } from '@/shared/lib';

import { orderWeekdays, weekdayDate } from '../../../lib/weekday';
import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';

export const useAnalyticsOverview = () => {
  const t = useTranslations('analytics.overview');
  const format = useFormatter();
  const { account, period } = useAnalyticsFilters();
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.overview({ account, period }),
    queryFn: ({ signal }) => getAnalyticsOverview({ account, period, signal }),
    requiresPlus: true
  });

  const hours = data?.hours ?? [];
  const weekdays = orderWeekdays(data?.weekdays ?? []);
  const trend = data?.trend ?? [];
  const totals = data?.totals;

  return {
    data,
    status,
    isEmpty: (data?.totals.battles ?? 0) === 0,
    isRetrying,
    retry,
    tones: {
      winRate: totals?.winRate === null || totals?.winRate === undefined ? 'steel' : ratingTone({ scale: 'winRate', value: totals.winRate }),
      wn8: totals?.wn8 === null || totals?.wn8 === undefined ? 'steel' : ratingTone({ scale: 'wn8', value: totals.wn8 })
    } as const,
    hourChart: {
      labels: hours.map(({ hour }) => String(hour).padStart(2, '0')),
      series: [{ id: 'winRate', label: t('charts.winRate'), values: hours.map(({ winRate }) => winRate ?? 0), tone: 'accent' as const }]
    },
    weekdayChart: {
      labels: weekdays.map(({ weekday }) => format.dateTime(weekdayDate(weekday), { weekday: 'short', timeZone: 'UTC' })),
      series: [{ id: 'winRate', label: t('charts.winRate'), values: weekdays.map(({ winRate }) => winRate ?? 0), tone: 'accent' as const }]
    },
    trendLabels: trend.map(({ at }) => format.dateTime(new Date(at), { day: 'numeric', month: 'short' })),
    winRateSeries: [{ id: 'winRate', label: t('charts.winRate'), values: trend.map(({ winRate }) => winRate ?? 0), tone: 'accent' as const }],
    damageSeries: [{ id: 'avgDamage', label: t('charts.avgDamage'), values: trend.map(({ avgDamage }) => avgDamage ?? 0), tone: 'steel' as const }],
    wn8Series: [{ id: 'wn8', label: t('charts.wn8'), values: trend.map(({ wn8 }) => wn8 ?? 0), tone: 'good' as const }],
    formatPercent: (value: number) => percentText({ format, value, digits: 1 }),
    formatNumber: (value: number) => format.number(value, 'integer')
  };
};
