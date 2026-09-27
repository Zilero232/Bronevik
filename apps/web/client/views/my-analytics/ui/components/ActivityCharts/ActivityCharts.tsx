import { useTranslations } from 'next-intl';

import { BarChart, Card, CardHeader } from '@/ui-kit';

import type { ActivityChartsProps } from './ActivityCharts.types';

import { ANALYTICS_VIEW } from '../../../config';

import s from './ActivityCharts.module.scss';

export const ActivityCharts = ({ hours, weekdays, formatPercent }: ActivityChartsProps) => {
  const t = useTranslations('analytics.overview.charts');

  return (
    <div className={s.root}>
      <Card padding='none'>
        <CardHeader meta={t('winRateMeta')} title={t('hoursTitle')} />
        <div className={s.chart}>
          <BarChart
            ariaLabel={t('hoursTitle')}
            formatValue={formatPercent}
            height={ANALYTICS_VIEW.chartHeight}
            labels={hours.labels}
            series={hours.series}
          />
        </div>
      </Card>
      <Card padding='none'>
        <CardHeader meta={t('winRateMeta')} title={t('weekdaysTitle')} />
        <div className={s.chart}>
          <BarChart
            ariaLabel={t('weekdaysTitle')}
            formatValue={formatPercent}
            height={ANALYTICS_VIEW.chartHeight}
            labels={weekdays.labels}
            series={weekdays.series}
          />
        </div>
      </Card>
    </div>
  );
};
