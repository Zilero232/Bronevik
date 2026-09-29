'use client';

import type { BuildMode, LearningDifficulty } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { FilterField, SegmentedControl, ToggleChips } from '@/ui-kit';

import { useCatalogControls } from '../../../model/hooks';

export const CatalogControls = () => {
  const t = useTranslations('buildsCatalog');
  const tTraits = useTranslations('tankTraits');
  const { mode, modeOptions, difficulties, difficultyOptions, active, onModeChange, onDifficultiesChange, onReset } = useCatalogControls();

  return (
    <VehicleFilters
      leading={
        <FilterField label={t('modeLabel')}>
          <SegmentedControl<BuildMode> aria-label={t('modeLabel')} options={modeOptions} value={mode} onChange={onModeChange} />
        </FilterField>
      }
      extraActive={active}
      onExtraReset={onReset}
    >
      <FilterField count={difficulties.length} label={tTraits('difficulty.label')}>
        <ToggleChips<LearningDifficulty>
          aria-label={tTraits('difficulty.label')}
          options={difficultyOptions}
          value={difficulties}
          onChange={onDifficultiesChange}
        />
      </FilterField>
    </VehicleFilters>
  );
};
