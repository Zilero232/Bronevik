'use client';

import { parseISO } from 'date-fns';
import { useFormatter } from 'next-intl';

import { useTankTrend } from '../use-tank-trend';

export const useTrendCharts = () => {
  const format = useFormatter();
  const { data: trend, isPending, isError, refetch } = useTankTrend();

  const points = (trend ?? []).flatMap(({ date, winRate, avgDamage }) =>
    winRate === null || avgDamage === null ? [] : [{ date, winRate, avgDamage }]
  );

  const labels = points.map(({ date }) => format.dateTime(parseISO(date), { day: 'numeric', month: 'short' }));
  const winRates = points.map(({ winRate }) => winRate);
  const damages = points.map(({ avgDamage }) => avgDamage);

  const formatPercent = (value: number) => `${format.number(value, { maximumFractionDigits: 1 })}\u00A0%`;
  const formatDamage = (value: number) => format.number(value, { maximumFractionDigits: 0 });

  return { labels, winRates, damages, isEmpty: points.length === 0, isPending, isError, refetch, formatPercent, formatDamage };
};
