'use client';

import type { LearningDifficulty, TankStatus } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import { useTraitFilters } from '../../../../../model/hooks';

import s from './TraitFilters.module.scss';

export const TraitFilters = () => {
  const t = useTranslations('tankTraits');
  const { statuses, statusOptions, difficulties, difficultyOptions, onStatusesChange, onDifficultiesChange } = useTraitFilters();

  return (
    <div className={s.root}>
      <ToggleChips<TankStatus> aria-label={t('status.label')} options={statusOptions} size='sm' value={statuses} onChange={onStatusesChange} />
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
