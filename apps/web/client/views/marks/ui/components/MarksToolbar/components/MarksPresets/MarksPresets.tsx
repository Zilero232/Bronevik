'use client';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { MarksPresetId } from '../../../../../model/hooks';

import { useMarksPresets } from '../../../../../model/hooks';

import s from './MarksPresets.module.scss';

export const MarksPresets = () => {
  const t = useTranslations('marks.presets');
  const { options, active, onChange } = useMarksPresets();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.label}>
        {t('label')}
      </span>
      <ToggleChips<MarksPresetId> aria-label={t('label')} options={options} size='sm' value={active} onChange={onChange} />
    </div>
  );
};
