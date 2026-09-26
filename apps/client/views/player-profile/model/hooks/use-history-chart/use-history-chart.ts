'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { percentText } from '@/shared/lib';

import type { UseHistoryChartInput } from './use-history-chart.types';

import { seriesSummary } from '../../../lib/series-summary';

export const useHistoryChart = ({ metric, series }: UseHistoryChartInput) => {
  const t = useTranslations('profile.charts');
  const format = useFormatter();

  const points = series?.points.filter(({ value }) => value !== null) ?? [];
  const values = points.map(({ value }) => value ?? 0);
  const isPercent = metric === 'winRate';
  const summary = seriesSummary(values);

  const formatValue = (value: number) =>
    isPercent ? percentText({ format, value }) : format.number(value, { maximumFractionDigits: 0, useGrouping: false });

  return {
    summary,
    change: summary ? signed({ value: summary.change, digits: isPercent ? 1 : 0 }) : undefined,
    isBar: metric === 'battles',
    formatValue,
    labels: points.map(({ at }) => format.dateTime(new Date(at), { day: 'numeric', month: 'short' })),
    chartSeries: [{ id: metric, label: t(`metric.${metric}`), values, tone: 'accent' as const }],
    markers: (series?.markers ?? []).map(({ at, kind, label }) => ({
      id: `${kind}-${at}`,
      kind,
      text: `${t(`marker.${kind}`, { label })} · ${format.dateTime(new Date(at), { day: 'numeric', month: 'short' })}`
    }))
  };
};
