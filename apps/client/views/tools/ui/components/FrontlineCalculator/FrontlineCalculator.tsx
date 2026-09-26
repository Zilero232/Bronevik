'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RangeSlider } from '@/ui-kit';

import type { FrontlineValues } from '../../../model/hooks';

import { FRONTLINE, FRONTLINE_FIELDS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { FrontlineResults } from './components';

export const FrontlineCalculator = () => {
  const t = useTranslations('tools.frontline');
  const format = useFormatter();
  const { values, field } = useCalcState<FrontlineValues>({ ...FRONTLINE.defaults });

  return (
    <CalcShell
      inputs={
        <>
          <FieldGrid
            fields={FRONTLINE_FIELDS.map(({ key, range }) => ({ key, label: t(`fields.${key}`), hint: t(`hints.${key}`), ...range }))}
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
          <RangeSlider
            {...FRONTLINE.ranges.battlesPerDay}
            label={t('battlesPerDay')}
            value={values.battlesPerDay}
            valueLabel={format.number(values.battlesPerDay)}
            onValueChange={field('battlesPerDay')}
          />
        </>
      }
      description={t('description')}
      footer={t('footer')}
      results={<FrontlineResults values={values} />}
      title={t('title')}
    />
  );
};
