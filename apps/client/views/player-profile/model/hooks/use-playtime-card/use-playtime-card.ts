'use client';

import { useFormatter, useLocale } from 'next-intl';

import { PLAYTIME } from '../../../config';
import { playtimeSummary } from '../../../lib/playtime-summary';
import { weekdayName } from '../../../lib/weekday-name';
import { usePlayerPlaytime } from '../use-profile-queries';

export const usePlaytimeCard = () => {
  const locale = useLocale();
  const format = useFormatter();
  const { data: playtime, isPending, isError, isRefetching, refetch } = usePlayerPlaytime();

  const hasData = playtime !== undefined && playtime.source !== 'none' && playtime.battles > 0;

  return {
    playtime: hasData ? playtime : null,
    summary: hasData ? playtimeSummary({ cells: playtime.cells, minBattles: PLAYTIME.minSlotBattles }) : null,
    isApproximate: playtime?.source === 'snapshots',
    isEmpty: playtime !== undefined && !hasData,
    weekday: (index: number) => weekdayName({ locale, index }),
    shortWeekday: (index: number) => weekdayName({ locale, index, width: 'short' }),
    rate: (value: number) => format.number(value, { maximumFractionDigits: 1 }),
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
