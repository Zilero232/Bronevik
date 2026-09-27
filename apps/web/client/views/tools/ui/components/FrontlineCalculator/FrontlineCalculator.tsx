'use client';

import { useTranslations } from 'next-intl';

import type { FrontlineValues } from '../../../model/hooks';

import { FRONTLINE, FRONTLINE_FIELDS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { BattlesPerDayField } from '../BattlesPerDayField';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { FrontlineResults } from './components';

export const FrontlineCalculator = () => {
  const t = useTranslations('tools.frontline');
  const { values, field } = useCalcState<FrontlineValues>({ ...FRONTLINE.defaults });

  return (
    <CalcShell
      inputs={
        <>
          <FieldGrid
            field={field}
            fields={FRONTLINE_FIELDS.map(({ key, range }) => ({ key, label: t(`fields.${key}`), hint: t(`hints.${key}`), ...range }))}
            values={values}
          />
          <BattlesPerDayField
            {...FRONTLINE.ranges.battlesPerDay}
            label={t('battlesPerDay')}
            value={values.battlesPerDay}
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
