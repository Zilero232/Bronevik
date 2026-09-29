'use client';

import { useTranslations } from 'next-intl';

import type { PlaytimeGridProps } from './PlaytimeGrid.types';

import { usePlaytimeGrid } from '../../../../../model/hooks';

import s from './PlaytimeGrid.module.scss';

export const PlaytimeGrid = ({ cells, weekdayLabel }: PlaytimeGridProps) => {
  const t = useTranslations('profile.insights.playtime');
  const { hours, rows } = usePlaytimeGrid(cells);

  return (
    <div className={s.scroller}>
      <div aria-label={t('gridLabel')} className={s.grid} role='img'>
        <span />
        {hours.map(({ hour, label }) => (
          <span aria-hidden key={hour} className={s.hour}>
            {label}
          </span>
        ))}
        {rows.map(({ weekday, cells: row }) => [
          <span aria-hidden key={`label-${weekday}`} className={s.weekday}>
            {weekdayLabel(weekday)}
          </span>,
          ...row.map(({ key, title, isEmpty, shift, weight }) => (
            <span key={key} className={s.cell} data-empty={isEmpty} style={{ '--shift': shift, '--weight': weight }} title={title} />
          ))
        ])}
      </div>
    </div>
  );
};
