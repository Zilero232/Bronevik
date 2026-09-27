'use client';

import { useTranslations } from 'next-intl';

import { Badge, BarChart, DeltaValue, EmptyState, LineChart } from '@/ui-kit';

import type { HistoryChartProps } from './HistoryChart.types';

import { HISTORY_CHART } from '../../../../../config';
import { useHistoryChart } from '../../../../../model/hooks';

import s from './HistoryChart.module.scss';

export const HistoryChart = ({ metric, series }: HistoryChartProps) => {
  const t = useTranslations('profile.charts');
  const { summary, changeFormat, isBar, formatValue, labels, chartSeries, markers } = useHistoryChart({ metric, series });

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
        <div className={s.stat}>
          <dt>{t('summary.change')}</dt>
          <dd>
            <DeltaValue isSameShown className={s.change} format={changeFormat} value={summary.change} />
          </dd>
        </div>
      </dl>
      {isBar ? (
        <BarChart
          hasTableToggle
          ariaLabel={t(`metric.${metric}`)}
          formatValue={formatValue}
          height={HISTORY_CHART.height}
          labels={labels}
          series={chartSeries}
        />
      ) : (
        <LineChart
          hasTableToggle
          ariaLabel={t(`metric.${metric}`)}
          formatValue={formatValue}
          height={HISTORY_CHART.height}
          labels={labels}
          series={chartSeries}
        />
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
