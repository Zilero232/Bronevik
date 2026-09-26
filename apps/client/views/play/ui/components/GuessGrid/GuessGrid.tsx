'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { GUESS_CELLS, GUESS_TANK } from '../../../config';
import { useGuessGame } from '../../../model/context';
import { GuessRow } from '../GuessRow';

import s from './GuessGrid.module.scss';

export const GuessGrid = () => {
  const t = useTranslations('play.grid');
  const { guesses, status } = useGuessGame();

  const empty = status === 'playing' ? GUESS_TANK.maxGuesses - guesses.length : 0;

  return (
    <Card padding='none' variant='panel'>
      <CardHeader title={t('title')} />
      <div aria-hidden className={s.head}>
        <span>{t('columns.tank')}</span>
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
    </Card>
  );
};
