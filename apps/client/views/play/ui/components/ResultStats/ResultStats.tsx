'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { AnimatedNumber } from '@/ui-kit';

import { useGuessGame } from '../../../model/context';

import s from './ResultStats.module.scss';

export const ResultStats = () => {
  const t = useTranslations('play.result.stats');
  const format = useFormatter();
  const { streak, currentStreak } = useGuessGame();

  const winShare = streak.played > 0 ? streak.wins / streak.played : 0;

  return (
    <dl className={s.root}>
      <div className={s.item}>
        <dt className={s.label}>{t('streak')}</dt>
        <dd className={s.value} data-hot={currentStreak > 0}>
          <AnimatedNumber value={currentStreak} />
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('best')}</dt>
        <dd className={s.value}>
          <AnimatedNumber value={streak.best} />
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('played')}</dt>
        <dd className={s.value}>
          <AnimatedNumber value={streak.played} />
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('wins')}</dt>
        <dd className={s.value}>{format.number(winShare, { style: 'percent', maximumFractionDigits: 0 })}</dd>
      </div>
    </dl>
  );
};
