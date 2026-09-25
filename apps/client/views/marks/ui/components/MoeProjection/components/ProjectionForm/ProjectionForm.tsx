'use client';

import { MarkOfExcellenceIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { NumberField, RangeSlider, SegmentedControl } from '@/ui-kit';

import type { ProjectionFormProps } from '../../MoeProjection.types';

import { MOE_PROJECTION, TARGET_MARKS } from '../../../../../config';

import s from './ProjectionForm.module.scss';

export const ProjectionForm = ({ inputs, threshold, onVehicleChange, onPercentChange, onDamageChange, onMarksChange }: ProjectionFormProps) => {
  const t = useTranslations('marks.projection');
  const format = useFormatter();
  const { vehicle, percent, damage, marks } = inputs;
  const { percentRange, damageRange } = MOE_PROJECTION;

  return (
    <div className={s.root}>
      <TankPicker label={t('tank')} placeholder={t('pickTank')} value={vehicle} onChange={onVehicleChange} />
      {threshold && (
        <p className={s.thresholds}>
          {t('thresholdsHint', { p65: format.number(threshold.p65), p85: format.number(threshold.p85), p95: format.number(threshold.p95) })}
        </p>
      )}
      <RangeSlider
        label={t('percent')}
        max={percentRange.max}
        min={percentRange.min}
        step={percentRange.step}
        value={percent}
        valueLabel={`${format.number(percent, { maximumFractionDigits: 2 })}%`}
        onValueChange={onPercentChange}
      />
      <NumberField
        hint={t('damageHint')}
        label={t('damage')}
        max={damageRange.max}
        min={damageRange.min}
        step={damageRange.step}
        value={damage}
        onValueChange={onDamageChange}
      />
      <div className={s.target}>
        <span className={s.targetLabel}>{t('target')}</span>
        <SegmentedControl
          options={TARGET_MARKS.map((option) => ({
            value: option.value,
            label: t('marks', { count: option.marks }),
            icon: <MarkOfExcellenceIcon aria-hidden marks={option.marks} size={16} />
          }))}
          aria-label={t('target')}
          value={marks}
          onChange={onMarksChange}
        />
      </div>
    </div>
  );
};
