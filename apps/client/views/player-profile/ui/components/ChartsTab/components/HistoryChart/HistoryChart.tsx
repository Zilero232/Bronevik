'use client';

import { Flag, Sparkles } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { percentText } from '@/shared/lib';
import { Badge, BarChart, LineChart, Skeleton } from '@/ui-kit';

import type { HistoryChartProps } from './HistoryChart.types';

import { seriesSummary } from '../../../../../lib/series-summary';
import { TabState } from '../../../TabState';

import s from './HistoryChart.module.scss';

const HEIGHT = 320;

export const HistoryChart = ({ metric, series, isLoading, isError }: HistoryChartProps) => {
  const t = useTranslations('profile.charts');
  const format = useFormatter();

  if (isError) {
    return <TabState kind='error' />;
  }

  if (isLoading || !series) {
    return <Skeleton height={HEIGHT + 64} shape='block' />;
  }

  const points = series.points.filter(({ value }) => value !== null);
  const isPercent = metric === 'winRate';
  const values = points.map(({ value }) => value ?? 0);
  const summary = seriesSummary(values);
  const formatValue = (value: number) =>
    isPercent ? percentText({ format, value }) : format.number(value, { maximumFractionDigits: 0, useGrouping: false });

  const labels = points.map(({ at }) => format.dateTime(new Date(at), { day: 'numeric', month: 'short' }));
  const chartSeries = [{ id: metric, label: t(`metric.${metric}`), values, tone: 'accent' as const }];

  if (!summary) {
    return <TabState kind='empty' />;
  }

  return (
    <div className={s.root}>
      <dl className={s.summary}>
        {(['last', 'average', 'max', 'min'] as const).map((key) => (
          <div key={key} className={s.stat}>
            <dt>{t(`summary.${key}`)}</dt>
            <dd>{formatValue(summary[key])}</dd>
          </div>
        ))}
        <div className={s.stat} data-trend={summary.change >= 0 ? 'up' : 'down'}>
          <dt>{t('summary.change')}</dt>
          <dd>{signed({ value: summary.change, digits: isPercent ? 1 : 0 })}</dd>
        </div>
      </dl>
      {metric === 'battles' ? (
        <BarChart ariaLabel={t(`metric.${metric}`)} formatValue={formatValue} height={HEIGHT} labels={labels} series={chartSeries} />
      ) : (
        <LineChart withArea ariaLabel={t(`metric.${metric}`)} formatValue={formatValue} height={HEIGHT} labels={labels} series={chartSeries} />
      )}
      {series.markers.length > 0 && (
        <ul aria-label={t('markers')} className={s.markers}>
          {series.markers.map(({ at, kind, label }) => (
            <li key={`${kind}-${at}`}>
              <Badge tone={kind === 'patch' ? 'steel' : 'accent'}>
                {kind === 'patch' ? <Flag size={11} /> : <Sparkles size={11} />}
                {t(`marker.${kind}`, { label })} · {format.dateTime(new Date(at), { day: 'numeric', month: 'short' })}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
