'use client';

import type { BuildMode, LearningDifficulty } from '@otmetki/schemas';

import { BUILD_USAGE, LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { shortList } from '@/shared/lib';

import { BUILDS_CATALOG_VIEW } from '../../../config';
import { useCatalogState } from '../use-catalog-state';

export const useCatalogControls = () => {
  const t = useTranslations('buildsCatalog');
  const tDifficulty = useTranslations('tankTraits.difficulty');
  const tFilters = useTranslations('common.filters');
  const [{ mode, difficulties }, setState] = useCatalogState();

  const modeOptions = BUILD_USAGE.modes.map((value) => ({ value, label: t(`modes.${value}`) }));
  const difficultyOptions = LEARNING_DIFFICULTIES.map((value) => ({ value, label: tDifficulty(value) }));

  const active: ActiveFilter[] =
    difficulties.length > 0
      ? [
          {
            id: 'difficulties',
            label: tFilters('span', {
              label: tDifficulty('label'),
              value: shortList({ items: difficulties.map((value) => tDifficulty(value)), max: BUILDS_CATALOG_VIEW.chipItems })
            }),
            onRemove: () => void setState({ difficulties: null })
          }
        ]
      : [];

  const onModeChange = (next: BuildMode) => {
    void setState({ mode: next });
  };

  const onDifficultiesChange = (next: LearningDifficulty[]) => {
    void setState({ difficulties: next.length > 0 ? next : null });
  };

  return {
    mode,
    modeOptions,
    difficulties,
    difficultyOptions,
    active,
    onModeChange,
    onDifficultiesChange,
    onReset: () => void setState({ difficulties: null })
  };
};
