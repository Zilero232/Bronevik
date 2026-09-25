'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { PlaytimeGridProps } from './PlaytimeGrid.types';

import s from './PlaytimeGrid.module.scss';

const WEEKDAYS = 7;
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const NEUTRAL_RATE = 50;
const RATE_SPREAD = 12;

export const PlaytimeGrid = ({ cells, weekdayLabel }: PlaytimeGridProps) => {
  const t = useTranslations('profile.insights.playtime');
  const format = useFormatter();

  const maxBattles = Math.max(1, ...cells.map(({ battles }) => battles));

  return (
    <div className={s.scroller}>
      <div aria-label={t('gridLabel')} className={s.grid} role='img'>
        <span />
        {HOURS.map((hour) => (
          <span aria-hidden key={hour} className={s.hour}>
            {hour % 3 === 0 ? hour : ''}
          </span>
        ))}
        {Array.from({ length: WEEKDAYS }, (_, weekday) => [
          <span aria-hidden key={`label-${weekday}`} className={s.weekday}>
            {weekdayLabel(weekday)}
          </span>,
          ...HOURS.map((hour) => {
            const cell = cells.find((item) => item.weekday === weekday && item.hour === hour);
            const rate = cell?.winRate ?? null;
            const shift = rate === null ? 0 : Math.max(-1, Math.min(1, (rate - NEUTRAL_RATE) / RATE_SPREAD));

            return (
              <span
                key={`${weekday}-${hour}`}
                title={
                  cell && rate !== null
                    ? t('cell', { hour, battles: cell.battles, rate: format.number(rate, { maximumFractionDigits: 1 }) })
                    : undefined
                }
                className={s.cell}
                data-empty={rate === null}
                style={{ '--shift': shift, '--weight': (cell?.battles ?? 0) / maxBattles }}
              />
            );
          })
        ])}
      </div>
    </div>
  );
};
