'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { mapShareText } from '../../../lib/map-share';
import { useGuessMap } from '../../context';

export const useMapResult = () => {
  const t = useTranslations('play.map.result');
  const { number, target, guesses, status, streak, currentStreak, refreshDay } = useGuessMap();
  const { copy } = useCopy();

  const isWon = status === 'won';

  const onShare = async () => {
    await copy(
      mapShareText({ title: t('shareTitle'), number, results: guesses.map(({ hints }) => hints.isCorrect), isWon, url: window.location.href })
    );

    toast.success(t('copied'), { description: t('copiedHint') });
  };

  return { target, guessCount: guesses.length, isWon, streak, currentStreak, refreshDay, onShare };
};
