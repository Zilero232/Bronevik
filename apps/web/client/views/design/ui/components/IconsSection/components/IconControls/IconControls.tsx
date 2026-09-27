'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { IconControlsProps } from './IconControls.types';

import { DESIGN_ICONS } from '../../../../../config';

import s from './IconControls.module.scss';

export const IconControls = ({ size, stroke, onSizeChange, onStrokeChange }: IconControlsProps) => {
  const t = useTranslations('design.icons');

  return (
    <div className={s.controls}>
      <SegmentedControl
        aria-label={t('size')}
        options={DESIGN_ICONS.sizes.map((value) => ({ value, label: value }))}
        size='sm'
        value={size}
        onChange={onSizeChange}
      />
      <SegmentedControl
        aria-label={t('stroke')}
        options={DESIGN_ICONS.strokes.map((value) => ({ value, label: value }))}
        size='sm'
        value={stroke}
        onChange={onStrokeChange}
      />
    </div>
  );
};
