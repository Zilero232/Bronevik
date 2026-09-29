'use client';

import { useFormatter } from 'next-intl';

import type { ChartSeries } from '@/ui-kit';

import { percentText } from '@/shared/lib';

import { HISTORY_SERIES } from '../../../config';
import { historySeries } from '../../../lib/moe-history';
import { useMoeHistory } from '../use-moe-history';

export const useMoeHistoryChart = (tankId: number) => {
  const format = useFormatter();
  const query = useMoeHistory({ tankId });

  const history = historySeries(query.data ?? []);
  const series: ChartSeries[] = HISTORY_SERIES.filter(({ key }) => key !== 'p100' || history.p100.length === history.dates.length).map(
    ({ key, percent, tone }) => ({ id: key, label: percentText({ format, value: percent, digits: 0 }), values: history[key], tone })
  );

  return {
    query,
    series,
    isEmpty: history.dates.length < 2,
    labels: history.dates.map((date) => format.dateTime(new Date(date), { day: 'numeric', month: 'short' })),
    formatValue: (value: number) => format.number(value)
  };
};
