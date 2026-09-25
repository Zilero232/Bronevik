'use client';

import { Crosshair, Flame, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { GUESS_TANK } from '../../../config';
import { useGuessGame } from '../../../model/context';

import s from './GuessStatusBar.module.scss';

export const GuessStatusBar = () => {
  const t = useTranslations('play.status');
  const { number, guesses, currentStreak } = useGuessGame();

  const left = GUESS_TANK.maxGuesses - guesses.length;

  return (
    <dl className={s.root}>
      <div className={s.item}>
        <dt className={s.label}>
          <Hash aria-hidden size={14} />
          {t('puzzle')}
        </dt>
        <dd className={s.value}>{number}</dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>
          <Crosshair aria-hidden size={14} />
          {t('shells')}
        </dt>
        <dd aria-label={t('shellsLeft', { count: left })} className={s.shells}>
          {Array.from({ length: GUESS_TANK.maxGuesses }, (_, index) => (
            <span aria-hidden key={index} className={s.shell} data-spent={index >= left} />
          ))}
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>
          <Flame aria-hidden size={14} />
          {t('streak')}
        </dt>
        <dd className={s.value} data-hot={currentStreak > 0}>
          {currentStreak}
        </dd>
      </div>
    </dl>
  );
};
