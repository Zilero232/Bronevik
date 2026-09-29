'use client';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { TanksPresetId } from '../../../../../model/hooks';

import { useTanksPresets } from '../../../../../model/hooks';

import s from './QuickFilters.module.scss';

export const QuickFilters = () => {
  const t = useTranslations('tanks.presets');
  const { options, active, onChange } = useTanksPresets();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.label}>
        {t('label')}
      </span>
      <ToggleChips<TanksPresetId> aria-label={t('label')} options={options} size='sm' value={active} onChange={onChange} />
    </div>
  );
};
