'use client';

import { MarkOfExcellenceIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { NumberField, RangeSlider, SegmentedControl } from '@/ui-kit';

import type { MoeTargetValue } from '../../../config';

import { MOE_CALC, MOE_TARGETS } from '../../../config';
import { useMoeCalculator } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { MoeResults } from './components';

export const MoeCalculator = () => {
  const t = useTranslations('tools.moe');
  const format = useFormatter();
  const { vehicle, setVehicle, values, field } = useMoeCalculator();

  return (
    <CalcShell
      inputs={
        <>
          <TankPicker label={t('tank')} placeholder={t('pickTank')} value={vehicle} onChange={setVehicle} />
          <RangeSlider
            {...MOE_CALC.percentRange}
            label={t('percent')}
            value={values.percent}
            valueLabel={format.number(values.percent / 100, { style: 'percent', maximumFractionDigits: 2 })}
            onValueChange={field('percent')}
          />
          <NumberField {...MOE_CALC.damageRange} hint={t('damageHint')} label={t('damage')} value={values.damage} onValueChange={field('damage')} />
          <SegmentedControl<MoeTargetValue>
            options={MOE_TARGETS.map((option) => ({
              value: option.value,
              label: t('marks', { count: option.marks }),
              icon: <MarkOfExcellenceIcon aria-hidden marks={option.marks} size={16} />
            }))}
            aria-label={t('target')}
            value={values.target}
            onChange={field('target')}
          />
        </>
      }
      description={t('description')}
      results={<MoeResults damage={values.damage ?? 0} percent={values.percent} target={values.target} vehicle={vehicle} />}
      title={t('title')}
    />
  );
};
