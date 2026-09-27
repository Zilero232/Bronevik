'use client';

import { useFormatter, useLocale } from 'next-intl';

import { PLAYTIME } from '../../../config';
import { playtimeSummary } from '../../../lib/playtime-summary';
import { weekdayName } from '../../../lib/weekday-name';
import { usePlayerPlaytime } from '../use-profile-queries';

export const usePlaytimeCard = () => {
  const locale = useLocale();
  const format = useFormatter();
  const query = usePlayerPlaytime();

  return {
    query,
    summary: query.data ? playtimeSummary({ cells: query.data.cells, minBattles: PLAYTIME.minSlotBattles }) : null,
    isApproximate: query.data?.source === 'snapshots',
    weekday: (index: number) => weekdayName({ locale, index }),
    shortWeekday: (index: number) => weekdayName({ locale, index, width: 'short' }),
    rate: (value: number) => format.number(value, { maximumFractionDigits: 1 })
  };
};
