'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { GuessCellProps } from './GuessCell.types';

import { CELL_FLIP, cellTransition } from './GuessCell.motion';

import s from './GuessCell.module.scss';

export const GuessCell = ({ hint, index, label, text, children }: GuessCellProps) => {
  const t = useTranslations('play.grid');

  const { verdict, direction } = hint;
  const summary = [label, text, t(`verdict.${verdict}`), direction && t(`direction.${direction}`)].filter(Boolean).join(', ');

  return (
    <motion.div {...CELL_FLIP} aria-label={summary} className={s.root} data-verdict={verdict} role='img' transition={cellTransition(index)}>
      <span aria-hidden className={s.content}>
        {children}
      </span>
      {direction === 'up' && <ArrowUp aria-hidden className={s.arrow} size={14} strokeWidth={2.5} />}
      {direction === 'down' && <ArrowDown aria-hidden className={s.arrow} size={14} strokeWidth={2.5} />}
    </motion.div>
  );
};
