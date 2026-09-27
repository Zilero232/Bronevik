'use client';

import { sumBy } from 'remeda';

import { usePlayerActivity } from '../use-profile-queries';

export const useActivity = () => {
  const query = usePlayerActivity();

  const days = query.data?.days.map(({ date, battles }) => ({ date, value: battles })) ?? [];
  const winRates = new Map(query.data?.days.map(({ date, winRate }) => [date, winRate]));

  return {
    days,
    total: sumBy(days, ({ value }) => value),
    active: days.filter(({ value }) => value > 0).length,
    winRateOf: (date: string) => winRates.get(date) ?? null,
    query
  };
};
