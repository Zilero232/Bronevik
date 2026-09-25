'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { GUESS_MOTION } from '../../../config';
import { msUntilNextPuzzle, puzzleDay } from '../../../lib/daily-puzzle';
import { useGuessGame } from '../../../model/context';
import { clock } from './Countdown.helpers';

import s from './Countdown.module.scss';

export const Countdown = () => {
  const t = useTranslations('play.result');
  const { day, refreshDay } = useGuessGame();
  const [now, setNow] = useState(() => Date.now());

  useInterval(() => {
    const next = Date.now();

    setNow(next);

    if (puzzleDay(new Date(next)) !== day) {
      refreshDay();
    }
  }, GUESS_MOTION.tickMs);

  return (
    <p className={s.root}>
      <Timer aria-hidden size={16} />
      <span className={s.label}>{t('next')}</span>
      <time suppressHydrationWarning className={s.clock}>
        {clock(msUntilNextPuzzle(new Date(now)))}
      </time>
    </p>
  );
};
