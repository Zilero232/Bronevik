'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';

import type { SessionBattlesProps } from './SessionBattles.types';

import { SESSION_DETAIL } from '../../../config';

import s from './SessionBattles.module.scss';

export const SessionBattles = ({ battles }: SessionBattlesProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <h4 className={s.heading}>{t('battles')}</h4>
      <ol className={s.list}>
        {battles.map((battle) => (
          <li key={battle.id} className={s.row} data-result={battle.result}>
            <span className={s.result}>{t(`result.${battle.result}`)}</span>
            <span className={s.map}>{battle.mapName}</span>
            <TankCell className={s.tank} image='contour' vehicle={battle.vehicle} />
            <span className={s.damage}>{format.number(battle.damageDealt)}</span>
            <span className={s.muted}>{t('frags', { count: battle.frags })}</span>
            {battle.moePercentDelta !== null && (
              <span className={s.moe} data-up={battle.moePercentDelta >= 0}>
                {format.number(battle.moePercentDelta / 100, {
                  style: 'percent',
                  signDisplay: 'exceptZero',
                  maximumFractionDigits: SESSION_DETAIL.moeDigits,
                  minimumFractionDigits: SESSION_DETAIL.moeDigits
                })}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};
