'use client';

import { AreaChart, BarChart, Card, CardHeader } from '@/ui-kit';

import type { UsageChartsProps } from './UsageCharts.types';

import { USAGE } from '../../../../../config';
import { useUsageCharts } from '../../../../../model/hooks';

import s from './UsageCharts.module.scss';

export const UsageCharts = ({ history }: UsageChartsProps) => {
  const { labels, requestsLabel, errorsLabel, requestsTitle, errorsTitle, requestSeries, errorSeries, formatValue } = useUsageCharts(history);

  return (
    <div className={s.root}>
      <Card className={s.card}>
        <CardHeader title={requestsTitle} />
        <AreaChart ariaLabel={requestsLabel} formatValue={formatValue} height={USAGE.chartHeight} labels={labels} series={requestSeries} />
      </Card>
      <Card className={s.card}>
        <CardHeader title={errorsTitle} />
        <BarChart ariaLabel={errorsLabel} formatValue={formatValue} height={USAGE.chartHeight} labels={labels} series={errorSeries} />
      </Card>
    </div>
  );
};
