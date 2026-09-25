'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { TankPicker } from '@/features/tank/pick-tank';
import { RangeSlider, Switch } from '@/ui-kit';

import type { ResearchValues } from './ResearchCalculator.types';

import { RESEARCH } from '../../../config';
import { useCalcState, useTechTreeCost } from '../../../model/hooks';
import { CalcShell, FieldGrid } from '../CalcKit';
import { ResearchResults } from './components';
import { RESEARCH_FIELDS } from './ResearchCalculator.constants';

export const ResearchCalculator = () => {
  const t = useTranslations('tools.research');
  const format = useFormatter();
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);
  const { values, field } = useCalcState<ResearchValues>({ ...RESEARCH.defaults, isPremium: false });
  const { cost } = useTechTreeCost(vehicle);

  const { battlesPerDay, isPremium } = values;

  return (
    <CalcShell
      inputs={
        <>
          <TankPicker label={t('tank')} placeholder={t('pickTank')} value={vehicle} onChange={setVehicle} />
          <FieldGrid
            fields={RESEARCH_FIELDS.map(({ key, range }) => ({ key, label: t(`fields.${key}`), ...range }))}
            values={values}
            onChange={({ key, value }) => field(key)(value ?? 0)}
          />
          <RangeSlider
            label={t('battlesPerDay')}
            max={RESEARCH.ranges.battlesPerDay.max}
            min={RESEARCH.ranges.battlesPerDay.min}
            step={RESEARCH.ranges.battlesPerDay.step}
            value={battlesPerDay}
            valueLabel={format.number(battlesPerDay)}
            onValueChange={field('battlesPerDay')}
          />
          <Switch checked={isPremium} description={t('premiumHint')} label={t('premium')} onCheckedChange={field('isPremium')} />
        </>
      }
      description={t('description')}
      footer={t('footer')}
      results={<ResearchResults cost={cost} values={values} vehicle={vehicle} />}
      title={t('title')}
    />
  );
};
