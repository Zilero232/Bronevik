'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

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
            <TankIdentity className={s.tank} tank={vehicleIdentity(vehicle)} />
            <span className={s.cell}>{t('battlesCount', { count: stats.battles })}</span>
            <RatingBadge size='sm' tone={winRateTone(stats.winRate)} value={percentText({ format, value: stats.winRate })} withPips={false} />
            <span className={s.cell}>{format.number(stats.avgDamage ?? 0)}</span>
            <RatingBadge label='WN8' size='sm' tone={ratingValueTone(stats.wn8)} value={format.number(stats.wn8.value ?? 0)} withPips={false} />
          </li>
        ))}
      </ul>
    </section>
  );
};
