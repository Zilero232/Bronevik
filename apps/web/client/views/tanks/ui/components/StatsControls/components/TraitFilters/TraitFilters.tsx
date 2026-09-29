'use client';

import type { LearningDifficulty } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import { useTraitFilters } from '../../../../../model/hooks';

import s from './TraitFilters.module.scss';

export const TraitFilters = () => {
  const t = useTranslations('tankTraits');
  const { difficulties, difficultyOptions, onDifficultiesChange } = useTraitFilters();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.label}>
        {t('difficulty.label')}
      </span>
      <ToggleChips<LearningDifficulty>
        aria-label={t('difficulty.label')}
        options={difficultyOptions}
        size='sm'
        value={difficulties}
        onChange={onDifficultiesChange}
      />
    </div>
  );
};
