'use client';

import { Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import type { ClueCardProps } from './ClueCard.types';

import { ClueValue } from '../ClueValue';
import { CLUE_FLIP } from './ClueCard.motion';

import s from './ClueCard.module.scss';

export const ClueCard = ({ clue, index, isRevealed }: ClueCardProps) => {
  const t = useTranslations('play.clues');

  return (
    <li className={s.root} data-revealed={isRevealed}>
      <span className={s.label}>{t(`labels.${clue}`)}</span>
      <AnimatePresence initial={false} mode='wait'>
        {isRevealed ? (
          <motion.span key='open' {...CLUE_FLIP} className={s.value}>
            <ClueValue clue={clue} />
          </motion.span>
        ) : (
          <motion.span key='locked' {...CLUE_FLIP} className={s.locked}>
            <Lock aria-hidden size={13} />
            {t('locked', { miss: index + 1 })}
          </motion.span>
        )}
      </AnimatePresence>
    </li>
  );
};
