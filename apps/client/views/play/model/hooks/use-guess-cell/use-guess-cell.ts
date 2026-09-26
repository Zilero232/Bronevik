'use client';

import { useTranslations } from 'next-intl';

import type { UseGuessCellInput } from './use-guess-cell.types';

export const useGuessCell = ({ hint, label, text }: UseGuessCellInput) => {
  const t = useTranslations('play.grid');

  const { verdict, direction } = hint;
  const summary = [label, text, t(`verdict.${verdict}`), direction && t(`direction.${direction}`)].filter(Boolean).join(', ');

  return { verdict, direction, summary };
};
