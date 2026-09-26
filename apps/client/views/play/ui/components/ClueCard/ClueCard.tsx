'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ClueCardProps } from './ClueCard.types';

import { ClueValue } from '../ClueValue';

import s from './ClueCard.module.scss';

export const ClueCard = ({ clue, index, isRevealed }: ClueCardProps) => {
  const t = useTranslations('play.clues');

  return (
    <li className={s.root} data-revealed={isRevealed}>
      <span className={s.label}>{t(`labels.${clue}`)}</span>
      {isRevealed ? (
        <span className={s.value}>
          <ClueValue clue={clue} />
        </span>
      ) : (
        <span className={s.locked}>
          <Lock aria-hidden size={12} />
          {t('locked', { miss: index + 1 })}
        </span>
      )}
    </li>
  );
};
