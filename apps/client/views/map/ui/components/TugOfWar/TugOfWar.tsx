'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { TugOfWarProps } from './TugOfWar.types';

import { teamWinRates } from '../../../lib/team-stats';

import s from './TugOfWar.module.scss';

export const TugOfWar = ({ teams }: TugOfWarProps) => {
  const t = useTranslations('maps.map.stats');
  const format = useFormatter();

  const { team1, team2, draws, share } = teamWinRates(teams);

  return (
    <div className={s.root}>
      <div className={s.teams}>
        <span className={s.team} data-side='1'>
          <span className={s.label}>{t('team1')}</span>
          <span className={s.rate}>{percentText({ format, value: team1 })}</span>
        </span>
        <span className={s.draws}>{t('draws', { value: percentText({ format, value: draws }) })}</span>
        <span className={s.team} data-side='2'>
          <span className={s.label}>{t('team2')}</span>
          <span className={s.rate}>{percentText({ format, value: team2 })}</span>
        </span>
      </div>
      <div aria-hidden className={s.bar}>
        <span className={s.fill} style={{ width: `${share * 100}%` }} />
      </div>
      <p className={s.verdict}>
        {t('verdict', { gap: format.number(Math.abs(team1 - team2), { maximumFractionDigits: 1 }), side: team1 >= team2 ? '1' : '2' })}
      </p>
    </div>
  );
};
