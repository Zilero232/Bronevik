'use client';

import type { BuildMode, LearningDifficulty } from '@otmetki/schemas';

import { BUILD_USAGE, LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { useCatalogState } from '../use-catalog-state';

export const useCatalogControls = () => {
  const t = useTranslations('buildsCatalog');
  const tDifficulty = useTranslations('tankTraits.difficulty');
  const [{ mode, difficulties }, setState] = useCatalogState();

  const modeOptions = BUILD_USAGE.modes.map((value) => ({ value, label: t(`modes.${value}`) }));
  const difficultyOptions = LEARNING_DIFFICULTIES.map((value) => ({ value, label: tDifficulty(value) }));

  const onModeChange = (next: BuildMode) => {
    void setState({ mode: next });
  };

  const onDifficultiesChange = (next: LearningDifficulty[]) => {
    void setState({ difficulties: next.length > 0 ? next : null });
  };

  return { mode, modeOptions, difficulties, difficultyOptions, onModeChange, onDifficultiesChange };
};
