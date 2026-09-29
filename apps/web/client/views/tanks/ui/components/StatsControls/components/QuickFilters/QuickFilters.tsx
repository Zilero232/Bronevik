'use client';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { TanksPresetId } from '../../../../../model/hooks';

import { useTanksPresets } from '../../../../../model/hooks';

export const QuickFilters = () => {
  const t = useTranslations('tanks.presets');
  const { options, active, onChange } = useTanksPresets();

  return <ToggleChips<TanksPresetId> aria-label={t('label')} options={options} size='sm' value={active} onChange={onChange} />;
};
