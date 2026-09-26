'use client';

import { useQuery } from '@tanstack/react-query';
import { useFormatter } from 'next-intl';

import { getPulse } from '@/entities/pulse/pulse';
import { QUERY_KEYS } from '@/shared/constants';

import { PULSE } from '../../../config';
import { heatGrid } from '../../../lib/heat-grid';

export const usePulseView = () => {
  const format = useFormatter();
  const {
    data: pulse,
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.pulse,
    queryFn: ({ signal }) => getPulse({ signal }),
    staleTime: PULSE.staleMs
  });

  const peak = pulse?.bestHours[0] ?? null;

  return {
    pulse: pulse ?? null,
    heat: heatGrid({ grid: pulse?.heatmap ?? [], levels: PULSE.levels }),
    peakHour: peak?.hour ?? null,
    peakShare: peak ? peak.share * 100 : null,
    series: {
      labels: pulse?.series.map((point) => format.dateTime(new Date(point.at), { weekday: 'short', hour: '2-digit', minute: '2-digit' })) ?? [],
      values: pulse?.series.map((point) => point.players) ?? []
    },
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
