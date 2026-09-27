'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import { useGuessGame } from '../../../model/context';

export const ResultStats = () => {
  const t = useTranslations('play.result.stats');
  const { streak, currentStreak } = useGuessGame();

  return (
    <KeyFigures>
      <KeyFigure label={t('streak')} value={currentStreak} />
      <KeyFigure label={t('best')} value={streak.best} />
      <KeyFigure label={t('played')} value={streak.played} />
      <KeyFigure
        format={{ style: 'percent', maximumFractionDigits: 0 }}
        label={t('wins')}
        value={streak.played > 0 ? streak.wins / streak.played : null}
      />
    </KeyFigures>
  );
};
