'use client';

import { useTranslations } from 'next-intl';

import type { PuzzleCountdownProps } from './PuzzleCountdown.types';

import { useNextPuzzleClock } from '../../model/hooks';

import s from './PuzzleCountdown.module.scss';

export const PuzzleCountdown = ({ onExpire }: PuzzleCountdownProps) => {
  const t = useTranslations('play.result');
  const clock = useNextPuzzleClock(onExpire);

  return (
    <p className={s.root}>
      <span className={s.label}>{t('next')}</span>
      <time suppressHydrationWarning className={s.clock}>
        {clock}
      </time>
    </p>
  );
};
