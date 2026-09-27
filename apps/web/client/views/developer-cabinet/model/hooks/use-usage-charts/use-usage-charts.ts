'use client';

import type { ApiUsagePoint } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';

import { usageSeries, usageTotals } from '../../../lib/usage-stats';

export const useUsageCharts = (history: ApiUsagePoint[]) => {
  const t = useTranslations('developer.usage.charts');
  const format = useFormatter();

  const { days, requests, errors, throttled } = usageSeries(history);
  const totals = usageTotals(history);

  const formatValue = (value: number) => format.number(value, { notation: 'compact' });

  return {
    labels: days.map((day) => format.dateTime(new Date(day), { day: 'numeric', month: 'short', timeZone: 'UTC' })),
    requestsLabel: t('requests'),
    errorsLabel: t('errors'),
    requestsTitle: t('requestsTotal', { total: format.number(totals.requests) }),
    errorsTitle: t('errorsTotal', { rate: format.number(totals.errorRate, { style: 'percent', maximumFractionDigits: 2 }) }),
    requestSeries: [{ id: 'requests', label: t('requests'), values: requests, tone: 'accent' as const }],
    errorSeries: [
      { id: 'errors', label: t('errors'), values: errors, tone: 'bad' as const },
      { id: 'throttled', label: t('throttled'), values: throttled, tone: 'average' as const }
    ],
    formatValue
  };
};
