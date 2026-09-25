'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { MarkOfExcellenceIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { TankPicker } from '@/features/tank/pick-tank';
import { NumberField, RangeSlider, SegmentedControl } from '@/ui-kit';

import type { MoeTargetValue } from '../../../config';
import type { MoeValues } from './MoeCalculator.types';

import { MOE_CALC, MOE_TARGETS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { CalcShell } from '../CalcKit';
import { MoeResults } from './components';

export const MoeCalculator = () => {
  const t = useTranslations('tools.moe');
  const format = useFormatter();
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);
  const { values, field } = useCalcState<MoeValues>({ ...MOE_CALC.defaults, target: '3' });

  const { percent, damage, target } = values;
  const { percentRange, damageRange } = MOE_CALC;

  return (
    <CalcShell
      inputs={
        <>
          <TankPicker label={t('tank')} placeholder={t('pickTank')} value={vehicle} onChange={setVehicle} />
          <RangeSlider
            {...percentRange}
            label={t('percent')}
            value={percent}
            valueLabel={`${format.number(percent, { maximumFractionDigits: 2 })}%`}
            onValueChange={field('percent')}
          />
          <NumberField {...damageRange} hint={t('damageHint')} label={t('damage')} value={damage} onValueChange={field('damage')} />
          <SegmentedControl<MoeTargetValue>
            options={MOE_TARGETS.map((option) => ({
              value: option.value,
              label: t('marks', { count: option.marks }),
              icon: <MarkOfExcellenceIcon aria-hidden marks={option.marks} size={16} />
            }))}
            aria-label={t('target')}
            value={target}
            onChange={field('target')}
          />
        </>
      }
      description={t('description')}
      results={<MoeResults damage={damage ?? 0} percent={percent} target={target} vehicle={vehicle} />}
      title={t('title')}
    />
  );
};
