'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROW_ITEM } from '@/shared/lib';

import type { SessionBattlesProps } from './SessionBattles.types';

import s from './SessionBattles.module.scss';

export const SessionBattles = ({ battles }: SessionBattlesProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <h4 className={s.heading}>{t('battles')}</h4>
      <ol className={s.list}>
        {battles.map((battle, index) => (
          <motion.li
            key={battle.id}
            animate='visible'
            className={s.row}
            custom={index}
            data-result={battle.result}
            initial='hidden'
            variants={ROW_ITEM}
          >
            <span className={s.result}>{t(`result.${battle.result}`)}</span>
            <span className={s.map}>{battle.mapName}</span>
            <TankIdentity className={s.tank} tank={vehicleIdentity(battle.vehicle)} withNation={false} />
            <span className={s.damage}>{format.number(battle.damageDealt)}</span>
            <span className={s.muted}>{t('frags', { count: battle.frags })}</span>
            {battle.moePercentDelta !== null && (
              <span className={s.moe} data-up={battle.moePercentDelta >= 0}>
                {signed({ value: battle.moePercentDelta, digits: 2 })}%
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
};
