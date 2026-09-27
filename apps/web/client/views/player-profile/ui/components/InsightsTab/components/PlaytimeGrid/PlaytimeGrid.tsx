'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { PlaytimeGridProps } from './PlaytimeGrid.types';

import { PLAYTIME } from '../../../../../config';
import { playtimeShift } from '../../../../../lib/playtime-shift';

import s from './PlaytimeGrid.module.scss';

export const PlaytimeGrid = ({ cells, weekdayLabel }: PlaytimeGridProps) => {
  const t = useTranslations('profile.insights.playtime');
  const format = useFormatter();

  const maxBattles = Math.max(1, ...cells.map(({ battles }) => battles));
  const hours = Array.from({ length: PLAYTIME.hours }, (_, hour) => hour);

  return (
    <div className={s.scroller}>
      <div aria-label={t('gridLabel')} className={s.grid} role='img'>
        <span />
        {hours.map((hour) => (
          <span aria-hidden key={hour} className={s.hour}>
            {hour % PLAYTIME.hourLabelStep === 0 ? hour : ''}
          </span>
        ))}
        {Array.from({ length: PLAYTIME.weekdays }, (_, weekday) => [
          <span aria-hidden key={`label-${weekday}`} className={s.weekday}>
            {weekdayLabel(weekday)}
          </span>,
          ...hours.map((hour) => {
            const cell = cells.find((item) => item.weekday === weekday && item.hour === hour);
            const rate = cell?.winRate ?? null;

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
                style={{ '--shift': playtimeShift(rate), '--weight': (cell?.battles ?? 0) / maxBattles }}
              />
            );
          })
        ])}
      </div>
    </div>
  );
};
