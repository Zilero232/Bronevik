'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { getAnalyticsRng } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';
import { percentText } from '@/shared/lib';

import { ANALYTICS_VIEW } from '../../../config';
import { bucketMidpoint } from '../../../lib/roll-percent';
import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';
import { useDistanceColumns } from '../use-distance-columns';

export const useAnalyticsRng = () => {
  const t = useTranslations('analytics.rng');
  const format = useFormatter();
  const { account, period } = useAnalyticsFilters();
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.rng({ account, period }),
    queryFn: ({ signal }) => getAnalyticsRng({ account, period, signal }),
    requiresPlus: true
  });

  const columns = useDistanceColumns();

  const buckets = data?.buckets ?? [];

  return {
    data,
    status,
    isRetrying,
    retry,
    columns,
    isEmpty: (data?.shots ?? 0) === 0,
    meanRoll: data?.meanRoll === null || data?.meanRoll === undefined ? null : data.meanRoll * ANALYTICS_VIEW.percentScale,
    chart: {
      labels: buckets.map((bucket) => format.number(bucketMidpoint(bucket) / ANALYTICS_VIEW.percentScale, 'signedPercent')),
      series: [{ id: 'share', label: t('chartSeries'), values: buckets.map((bucket) => bucket.share ?? 0), tone: 'accent' as const }]
    },
    formatPercent: (value: number) => percentText({ format, value, digits: 1 })
  };
};
