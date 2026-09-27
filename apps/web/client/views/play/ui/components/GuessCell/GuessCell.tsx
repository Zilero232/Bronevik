'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

import type { GuessCellProps } from './GuessCell.types';

import { useGuessCell } from '../../../model/hooks';

import s from './GuessCell.module.scss';

export const GuessCell = ({ hint, label, text, children }: GuessCellProps) => {
  const { verdict, direction, summary } = useGuessCell({ hint, label, text });

  return (
    <div aria-label={summary} className={s.root} data-verdict={verdict} role='img'>
      <span aria-hidden className={s.content}>
        {children}
      </span>
      {direction === 'up' && <ArrowUp aria-hidden className={s.arrow} size={12} />}
      {direction === 'down' && <ArrowDown aria-hidden className={s.arrow} size={12} />}
    </div>
  );
};
