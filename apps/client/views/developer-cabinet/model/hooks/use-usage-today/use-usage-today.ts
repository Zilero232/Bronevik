'use client';

import type { ApiUsage } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';

import { quotaShare, quotaTone, usageSeries } from '../../../lib/usage-stats';

export const useUsageToday = ({ today, limits, history }: ApiUsage) => {
  const t = useTranslations('developer.usage.today');
  const format = useFormatter();

  const { requests, errors } = usageSeries(history);
  const errorShare = today.requests > 0 ? today.errors / today.requests : 0;

  return {
    today,
    requestsLimit: limits.requestsPerDay,
    requestsTrend: requests,
    errorsTrend: errors,
    errorRate: t('errorRate', { rate: format.number(errorShare, { style: 'percent', maximumFractionDigits: 1 }) }),
    quotaTone: quotaTone(quotaShare({ used: today.requests, limit: limits.requestsPerDay })),
    quotaLabel: `${format.number(today.requests)} / ${format.number(limits.requestsPerDay)}`
  };
};
