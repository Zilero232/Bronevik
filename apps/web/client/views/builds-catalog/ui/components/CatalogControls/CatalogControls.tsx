'use client';

import type { BuildMode, LearningDifficulty } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { SegmentedControl, ToggleChips } from '@/ui-kit';

import { useCatalogControls } from '../../../model/hooks';

import s from './CatalogControls.module.scss';

export const CatalogControls = () => {
  const t = useTranslations('buildsCatalog');
  const tTraits = useTranslations('tankTraits');
  const { mode, modeOptions, difficulties, difficultyOptions, onModeChange, onDifficultiesChange } = useCatalogControls();

  return (
    <div className={s.root}>
      <SegmentedControl<BuildMode> aria-label={t('modeLabel')} options={modeOptions} size='sm' value={mode} onChange={onModeChange} />
      <VehicleFilters />
      <ToggleChips<LearningDifficulty>
        aria-label={tTraits('difficulty.label')}
        options={difficultyOptions}
        size='sm'
        value={difficulties}
        onChange={onDifficultiesChange}
      />
    </div>
  );
};
