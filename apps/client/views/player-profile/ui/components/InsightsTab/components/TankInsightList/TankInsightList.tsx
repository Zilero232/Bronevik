'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { TankCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';

import type { TankInsightListProps } from './TankInsightList.types';

import s from './TankInsightList.module.scss';

export const TankInsightList = ({ kind, tanks }: TankInsightListProps) => {
  const t = useTranslations('profile.insights');
  const format = useFormatter();

  return (
    <section className={s.root} data-kind={kind}>
      <h4 className={s.heading}>{t(kind === 'weak' ? 'weakTanks' : 'strongTanks')}</h4>
      <ol className={s.list}>
        {tanks.map(({ vehicle, battles, winRate, winRateDelta, damageRatio }) => (
          <li key={vehicle.tankId} className={s.row}>
            <TankCell className={s.tank} vehicle={vehicle} />
            <span className={s.meta}>
              {percentText({ format, value: winRate })} · {t('battles', { count: battles })}
            </span>
            <span className={s.delta}>{t('deltaPp', { value: signed({ value: winRateDelta ?? 0, digits: 1 }) ?? '0' })}</span>
            {damageRatio !== null && <span className={s.ratio}>{t('damageRatio', { value: Math.round(damageRatio * 100) })}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
};
