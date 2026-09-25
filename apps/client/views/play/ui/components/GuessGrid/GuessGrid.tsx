'use client';

import { useTranslations } from 'next-intl';

import { GUESS_CELLS, GUESS_TANK } from '../../../config';
import { useGuessGame } from '../../../model/context';
import { GuessRow } from '../GuessRow';

import s from './GuessGrid.module.scss';

export const GuessGrid = () => {
  const t = useTranslations('play.grid');
  const { guesses, status } = useGuessGame();

  const empty = status === 'playing' ? GUESS_TANK.maxGuesses - guesses.length : 0;

  return (
    <section aria-labelledby='guess-grid' className={s.root}>
      <h2 className={s.title} id='guess-grid'>
        {t('title')}
      </h2>
      <div aria-hidden className={s.head}>
        {GUESS_CELLS.map((key) => (
          <span key={key}>{t(`columns.${key}`)}</span>
        ))}
      </div>
      <ol className={s.rows}>
        {guesses.map((entry) => (
          <GuessRow key={entry.subject.vehicle.tankId} entry={entry} />
        ))}
        {Array.from({ length: empty }, (_, index) => (
          <li aria-hidden key={`empty-${guesses.length + index}`} className={s.empty}>
            {t('slot', { attempt: guesses.length + index + 1 })}
          </li>
        ))}
      </ol>
    </section>
  );
};
