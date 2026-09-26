'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';

import type { ChartSeries } from '@/ui-kit';

import { MOE_SERIES_TONES } from '../../../config';
import { moeSeries } from '../../../lib';
import { useMoeHistory } from '../use-moe-history';

export const useMoeChart = () => {
  const t = useTranslations('tank.marks');
  const format = useFormatter();
  const { data: history, isPending, isError, refetch } = useMoeHistory();

  const { labels, series } = moeSeries(history ?? []);

  const chart = {
    labels: labels.map((date) => format.dateTime(parseISO(date), { day: 'numeric', month: 'short' })),
    series: series.map(({ key, values }): ChartSeries => ({ id: key, label: t(`plates.${key}`), values, tone: MOE_SERIES_TONES[key] }))
  };

  const formatValue = (value: number) => format.number(value, { maximumFractionDigits: 0 });

  return { chart, isEmpty: labels.length < 2, isPending, isError, refetch, formatValue };
};
