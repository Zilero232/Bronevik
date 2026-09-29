'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import { GUESS_TANK } from '../../../config';
import { useGuessGame } from '../../../model/context';

export const GuessStatusBar = () => {
  const t = useTranslations('play.status');
  const { number, guesses, currentStreak } = useGuessGame();

  return (
    <KeyFigures isFramed isInline>
      <KeyFigure label={t('puzzle')} prefix='#' value={number} />
      <KeyFigure hint={t('shellsTotal', { total: GUESS_TANK.maxGuesses })} label={t('shells')} value={GUESS_TANK.maxGuesses - guesses.length} />
      <KeyFigure label={t('streak')} value={currentStreak} />
    </KeyFigures>
  );
};
