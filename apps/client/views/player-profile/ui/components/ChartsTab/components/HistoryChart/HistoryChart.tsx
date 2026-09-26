'use client';

import { useTranslations } from 'next-intl';

import { Badge, BarChart, EmptyState, ErrorState, LineChart, Skeleton } from '@/ui-kit';

import type { HistoryChartProps } from './HistoryChart.types';

import { HISTORY_CHART } from '../../../../../config';
import { useHistoryChart } from '../../../../../model/hooks';

import s from './HistoryChart.module.scss';

export const HistoryChart = ({ metric, series, isLoading, isError, isRetrying, onRetry }: HistoryChartProps) => {
  const t = useTranslations('profile.charts');
  const { summary, change, isBar, formatValue, labels, chartSeries, markers } = useHistoryChart({ metric, series });

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={onRetry} />;
  }

  if (isLoading || !series) {
    return <Skeleton height={HISTORY_CHART.height} shape='block' />;
  }

  if (!summary) {
    return <EmptyState isCompact title={t('empty')} />;
  }

  return (
    <div className={s.root}>
      <dl className={s.summary}>
        {HISTORY_CHART.summaryKeys.map((key) => (
          <div key={key} className={s.stat}>
            <dt>{t(`summary.${key}`)}</dt>
            <dd>{formatValue(summary[key])}</dd>
          </div>
        ))}
        <div className={s.stat} data-trend={summary.change >= 0 ? 'up' : 'down'}>
          <dt>{t('summary.change')}</dt>
          <dd>{change}</dd>
        </div>
      </dl>
      {isBar ? (
        <BarChart ariaLabel={t(`metric.${metric}`)} formatValue={formatValue} height={HISTORY_CHART.height} labels={labels} series={chartSeries} />
      ) : (
        <LineChart ariaLabel={t(`metric.${metric}`)} formatValue={formatValue} height={HISTORY_CHART.height} labels={labels} series={chartSeries} />
      )}
      {markers.length > 0 && (
        <ul aria-label={t('markers')} className={s.markers}>
          {markers.map(({ id, kind, text }) => (
            <li key={id}>
              <Badge tone={kind === 'patch' ? 'steel' : 'accent'}>{text}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
