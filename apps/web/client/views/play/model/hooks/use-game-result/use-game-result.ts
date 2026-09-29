'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { GUESS_TANK } from '../../../config';
import { shareText } from '../../../lib/share-text';
import { useGuessGame } from '../../context';

export const useGameResult = () => {
  const t = useTranslations('play.result');
  const { number, target, guesses, status, streak, currentStreak, refreshDay } = useGuessGame();
  const { copy } = useCopy();

  const isWon = status === 'won';

  const onShare = async () => {
    await copy(
      shareText({
        title: t('shareTitle'),
        number,
        feedback: guesses.map(({ feedback }) => feedback),
        isWon,
        maxGuesses: GUESS_TANK.maxGuesses,
        url: window.location.href
      })
    );

    toast.success(t('copied'), { description: t('copiedHint') });
  };

  return { target, guessCount: guesses.length, isWon, streak, currentStreak, refreshDay, onShare };
};
