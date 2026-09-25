'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { EASE_OUT, percentText, REVEAL_VIEWPORT } from '@/shared/lib';

import type { TugOfWarProps } from './TugOfWar.types';

import { teamShare } from '../../../lib/battle-duration';

import s from './TugOfWar.module.scss';

export const TugOfWar = ({ team1, team2 }: TugOfWarProps) => {
  const t = useTranslations('maps.map.stats');
  const format = useFormatter();

  const share = teamShare({ team1, team2 });
  const draws = Math.max(0, 100 - team1 - team2);
  const percent = (value: number) => percentText({ format, value });

  return (
    <section aria-label={t('tugLabel')} className={s.root}>
      <header className={s.head}>
        <span className={s.eyebrow}>{t('tugTitle')}</span>
        <span className={s.draws}>{t('draws', { value: percent(draws) })}</span>
      </header>
      <div className={s.teams}>
        <span className={s.team} data-side='1'>
          <span className={s.teamLabel}>{t('team1')}</span>
          <span className={s.rate}>{percent(team1)}</span>
        </span>
        <span className={s.team} data-side='2'>
          <span className={s.teamLabel}>{t('team2')}</span>
          <span className={s.rate}>{percent(team2)}</span>
        </span>
      </div>
      <div aria-hidden className={s.rope}>
        <motion.span
          className={s.pull}
          initial={{ width: '50%' }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          viewport={REVEAL_VIEWPORT}
          whileInView={{ width: `${share * 100}%` }}
        />
        <span className={s.center} />
      </div>
      <p className={s.verdict}>
        {t('verdict', { gap: format.number(Math.abs(team1 - team2), { maximumFractionDigits: 1 }), side: team1 >= team2 ? '1' : '2' })}
      </p>
    </section>
  );
};
