'use client';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { MapsPresetId } from '../../../../../model/hooks';

import { useMapsPresets } from '../../../../../model/hooks';

export const MapsPresets = () => {
  const t = useTranslations('maps.presets');
  const { options, active, onChange } = useMapsPresets();

  return <ToggleChips<MapsPresetId> aria-label={t('label')} options={options} value={active} onChange={onChange} />;
};
