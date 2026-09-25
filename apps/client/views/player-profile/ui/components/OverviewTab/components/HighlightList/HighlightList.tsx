'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { RatingBadge } from '@/ui-kit';

import type { HighlightListProps } from './HighlightList.types';

import s from './HighlightList.module.scss';

export const HighlightList = ({ kind, rows }: HighlightListProps) => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();

  return (
    <section className={s.root} data-kind={kind}>
      <h4 className={s.heading}>{t(kind)}</h4>
      {rows.length === 0 && <p className={s.empty}>{t('highlightsEmpty')}</p>}
      <ol className={s.list}>
        {rows.map((row) => (
          <li key={row.vehicle.tankId} className={s.row}>
            <TankIdentity className={s.tank} tank={vehicleIdentity(row.vehicle)} withNation={false} />
            <span className={s.battles}>{t('battlesShort', { count: row.battles })}</span>
            <RatingBadge size='sm' tone={ratingValueTone(row.wn8)} value={format.number(row.wn8.value ?? 0)} withPips={false} />
          </li>
        ))}
      </ol>
    </section>
  );
};
