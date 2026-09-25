'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { AreaChart, BarChart, Card, CardHeader } from '@/ui-kit';

import type { UsageChartsProps } from './UsageCharts.types';

import { USAGE } from '../../../../../config';
import { usageSeries, usageTotals } from '../../../../../lib/usage-stats';

import s from './UsageCharts.module.scss';

export const UsageCharts = ({ history }: UsageChartsProps) => {
  const t = useTranslations('developer.usage.charts');
  const format = useFormatter();

  const { days, requests, errors, throttled } = usageSeries(history);
  const totals = usageTotals(history);
  const labels = days.map((day) => format.dateTime(new Date(day), { day: 'numeric', month: 'short', timeZone: 'UTC' }));
  const formatValue = (value: number) => format.number(value, { notation: 'compact' });

  return (
    <div className={s.root}>
      <Card className={s.card}>
        <CardHeader eyebrow={t('requestsEyebrow')} title={t('requestsTotal', { total: format.number(totals.requests) })} />
        <AreaChart
          ariaLabel={t('requests')}
          formatValue={formatValue}
          height={USAGE.chartHeight}
          labels={labels}
          series={[{ id: 'requests', label: t('requests'), values: requests, tone: 'accent' }]}
        />
      </Card>
      <Card className={s.card}>
        <CardHeader
          eyebrow={t('errorsEyebrow')}
          title={t('errorsTotal', { rate: format.number(totals.errorRate, { style: 'percent', maximumFractionDigits: 2 }) })}
        />
        <BarChart
          series={[
            { id: 'errors', label: t('errors'), values: errors, tone: 'bad' },
            { id: 'throttled', label: t('throttled'), values: throttled, tone: 'average' }
          ]}
          ariaLabel={t('errors')}
          formatValue={formatValue}
          height={USAGE.chartHeight}
          labels={labels}
        />
      </Card>
    </div>
  );
};
