'use client';

import type { PlaytimeCell } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';

import { PLAYTIME } from '../../../config';
import { playtimeShift } from '../../../lib/playtime-shift';

export const usePlaytimeGrid = (cells: readonly PlaytimeCell[]) => {
  const t = useTranslations('profile.insights.playtime');
  const format = useFormatter();

  const maxBattles = Math.max(1, ...cells.map(({ battles }) => battles));
  const hours = Array.from({ length: PLAYTIME.hours }, (_, hour) => hour);

  return {
    hours: hours.map((hour) => ({ hour, label: hour % PLAYTIME.hourLabelStep === 0 ? hour : '' })),
    rows: Array.from({ length: PLAYTIME.weekdays }, (_, weekday) => ({
      weekday,
      cells: hours.map((hour) => {
        const cell = cells.find((item) => item.weekday === weekday && item.hour === hour);
        const rate = cell?.winRate ?? null;

        return {
          key: `${weekday}-${hour}`,
          title:
            cell && rate !== null ? t('cell', { hour, battles: cell.battles, rate: format.number(rate, { maximumFractionDigits: 1 }) }) : undefined,
          isEmpty: rate === null,
          shift: playtimeShift(rate),
          weight: (cell?.battles ?? 0) / maxBattles
        };
      })
    }))
  };
};
