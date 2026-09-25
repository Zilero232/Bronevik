'use client';

import { useTranslations } from 'next-intl';

import { mapModeKind, ModeIcon, useMapLabels } from '@/entities/map/map';
import { SegmentedControl } from '@/ui-kit';

import type { ModeSwitcherProps } from './ModeSwitcher.types';

import s from './ModeSwitcher.module.scss';

export const ModeSwitcher = ({ mode, available, onChange }: ModeSwitcherProps) => {
  const t = useTranslations('maps');
  const labels = useMapLabels();

  const isShared = (value: string) => available.filter((other) => mapModeKind(other) === mapModeKind(value)).length > 1;
  const labelOf = (value: string) => (isShared(value) ? `${labels.mode(value)} · ${value}` : labels.mode(value));

  return (
    <div className={s.root}>
      <span className={s.label}>{t('map.modeLabel')}</span>
      <SegmentedControl<string>
        aria-label={t('map.modeLabel')}
        className={s.control}
        options={available.map((value) => ({ value, label: labelOf(value), icon: <ModeIcon mode={value} size={14} /> }))}
        size='sm'
        value={mode}
        onChange={onChange}
      />
    </div>
  );
};
