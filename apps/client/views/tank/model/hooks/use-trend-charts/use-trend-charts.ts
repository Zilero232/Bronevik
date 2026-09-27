'use client';

import { parseISO } from 'date-fns';
import { useFormatter } from 'next-intl';

import { useTankTrend } from '../use-tank-trend';

export const useTrendCharts = () => {
  const format = useFormatter();
  const query = useTankTrend();

  const points = (query.data ?? []).flatMap(({ date, winRate, avgDamage }) =>
    winRate === null || avgDamage === null ? [] : [{ date, winRate, avgDamage }]
  );

  const formatPercent = (value: number) => `${format.number(value, { maximumFractionDigits: 1 })}\u00A0%`;
  const formatDamage = (value: number) => format.number(value, { maximumFractionDigits: 0 });

  return {
    query: {
      data: query.data && {
        labels: points.map(({ date }) => format.dateTime(parseISO(date), { day: 'numeric', month: 'short' })),
        winRates: points.map(({ winRate }) => winRate),
        damages: points.map(({ avgDamage }) => avgDamage)
      },
      isError: query.isError,
      isRefetching: query.isRefetching,
      refetch: query.refetch
    },
    formatPercent,
    formatDamage
  };
};
