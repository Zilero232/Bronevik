'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { RangeSlider, Switch } from '@/ui-kit';

import { RESEARCH, RESEARCH_FIELDS } from '../../../config';
import { useResearchCalculator } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { ResearchResults } from './components';

export const ResearchCalculator = () => {
  const t = useTranslations('tools.research');
  const format = useFormatter();
  const { vehicle, setVehicle, values, field, cost } = useResearchCalculator();

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
            {...RESEARCH.ranges.battlesPerDay}
            label={t('battlesPerDay')}
            value={values.battlesPerDay}
            valueLabel={format.number(values.battlesPerDay)}
            onValueChange={field('battlesPerDay')}
          />
          <Switch checked={values.isPremium} description={t('premiumHint')} label={t('premium')} onCheckedChange={field('isPremium')} />
        </>
      }
      description={t('description')}
      footer={t('footer')}
      results={<ResearchResults cost={cost} values={values} vehicle={vehicle} />}
      title={t('title')}
    />
  );
};
