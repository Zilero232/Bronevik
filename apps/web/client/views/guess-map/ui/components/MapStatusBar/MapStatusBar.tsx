'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import { GUESS_MAP } from '../../../config';
import { useGuessMap } from '../../../model/context';

export const MapStatusBar = () => {
  const t = useTranslations('play.map.status');
  const { number, guesses, currentStreak } = useGuessMap();

  return (
    <KeyFigures isFramed>
      <KeyFigure label={t('puzzle')} prefix='#' value={number} />
      <KeyFigure hint={t('guessesTotal', { total: GUESS_MAP.maxGuesses })} label={t('guesses')} value={GUESS_MAP.maxGuesses - guesses.length} />
      <KeyFigure label={t('streak')} value={currentStreak} />
    </KeyFigures>
  );
};
