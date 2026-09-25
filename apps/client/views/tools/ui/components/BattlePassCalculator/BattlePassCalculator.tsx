'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RangeSlider } from '@/ui-kit';

import type { BattlePassValues } from './BattlePassCalculator.types';

import { BATTLE_PASS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { CalcShell, FieldGrid } from '../CalcKit';
import { BATTLE_PASS_FIELDS } from './BattlePassCalculator.constants';
import { BattlePassResults } from './components';

export const BattlePassCalculator = () => {
  const t = useTranslations('tools.pass');
  const format = useFormatter();
  const { values, field } = useCalcState<BattlePassValues>({ ...BATTLE_PASS.defaults });

  const { battlesPerDay } = values;

  return (
    <CalcShell
      inputs={
        <>
          <FieldGrid
            fields={BATTLE_PASS_FIELDS.map(({ key, range }) => ({ key, label: t(`fields.${key}`), ...range }))}
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
          <RangeSlider
            {...BATTLE_PASS.battlesPerDayRange}
            label={t('battlesPerDay')}
            value={battlesPerDay}
            valueLabel={format.number(battlesPerDay)}
            onValueChange={field('battlesPerDay')}
          />
        </>
      }
      description={t('description')}
      footer={t('footer')}
      results={<BattlePassResults values={values} />}
      title={t('title')}
    />
  );
};
