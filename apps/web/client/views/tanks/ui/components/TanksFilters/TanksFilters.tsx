'use client';

import type { LearningDifficulty } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { FilterField, ToggleChips } from '@/ui-kit';

import type { TanksPresetId } from '../../../model/hooks';

import { useTanksFilters } from '../../../model/hooks';

export const TanksFilters = () => {
  const t = useTranslations('tankTraits');
  const tPresets = useTranslations('tanks.presets');
  const { isTable, difficulties, difficultyOptions, presets, active, onDifficultiesChange, onReset } = useTanksFilters();

  return (
    <VehicleFilters extraActive={active} onExtraReset={onReset}>
      <FilterField count={difficulties.length} label={t('difficulty.label')}>
        <ToggleChips<LearningDifficulty>
          aria-label={t('difficulty.label')}
          options={difficultyOptions}
          value={difficulties}
          onChange={onDifficultiesChange}
        />
      </FilterField>
      {isTable && (
        <FilterField label={tPresets('label')}>
          <ToggleChips<TanksPresetId> aria-label={tPresets('label')} options={presets.options} value={presets.active} onChange={presets.onChange} />
        </FilterField>
      )}
    </VehicleFilters>
  );
};
