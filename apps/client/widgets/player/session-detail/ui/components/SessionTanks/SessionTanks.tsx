'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';
import { TankCell, WinRateCell } from '@/entities/tank/tank';

import type { SessionTanksProps } from './SessionTanks.types';

import s from './SessionTanks.module.scss';

export const SessionTanks = ({ tanks }: SessionTanksProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <h4 className={s.heading}>{t('tanks')}</h4>
      <ul className={s.list}>
        {tanks.map(({ vehicle, stats }) => (
          <li key={vehicle.tankId} className={s.row}>
            <TankCell className={s.tank} vehicle={vehicle} />
            <span className={s.cell}>{t('battlesCount', { count: stats.battles })}</span>
            <WinRateCell className={s.value} value={stats.winRate} />
            <span className={s.cell}>{format.number(stats.avgDamage ?? 0)}</span>
            <span className={s.rating} data-tone={ratingValueTone(stats.wn8)}>
              {format.number(stats.wn8.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
