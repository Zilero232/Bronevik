'use client';

import type { LearningDifficulty } from '@otmetki/schemas';

import { LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { useTanksState } from '../use-tanks-state';

export const useTraitFilters = () => {
  const t = useTranslations('tankTraits');
  const [{ difficulties }, setState] = useTanksState();

  const difficultyOptions = LEARNING_DIFFICULTIES.map((value) => ({ value, label: t(`difficulty.${value}`) }));

  const onDifficultiesChange = (next: LearningDifficulty[]) => {
    void setState({ difficulties: next.length > 0 ? next : null });
  };

  return { difficulties, difficultyOptions, onDifficultiesChange };
};
