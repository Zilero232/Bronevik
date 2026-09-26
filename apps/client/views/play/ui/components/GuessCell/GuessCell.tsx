'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { GuessCellProps } from './GuessCell.types';

import s from './GuessCell.module.scss';

export const GuessCell = ({ hint, label, text, children }: GuessCellProps) => {
  const t = useTranslations('play.grid');

  const { verdict, direction } = hint;
  const summary = [label, text, t(`verdict.${verdict}`), direction && t(`direction.${direction}`)].filter(Boolean).join(', ');

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
