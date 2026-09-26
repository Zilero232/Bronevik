'use client';

import { sumBy } from 'remeda';

import { usePlayerActivity } from '../use-profile-queries';

export const useActivity = () => {
  const { data: activity, isPending, isError, isRefetching, refetch } = usePlayerActivity();

  const days = activity?.days.map(({ date, battles }) => ({ date, value: battles })) ?? [];
  const winRates = new Map(activity?.days.map(({ date, winRate }) => [date, winRate]));

  return {
    days,
    total: sumBy(days, ({ value }) => value),
    active: days.filter(({ value }) => value > 0).length,
    winRateOf: (date: string) => winRates.get(date) ?? null,
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
