'use client';

import { useTranslations } from 'next-intl';

import type { BattlePassValues } from '../../../model/hooks';

import { BATTLE_PASS, BATTLE_PASS_FIELDS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { BattlesPerDayField } from '../BattlesPerDayField';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { BattlePassResults } from './components';

export const BattlePassCalculator = () => {
  const t = useTranslations('tools.pass');
  const { values, field } = useCalcState<BattlePassValues>({ ...BATTLE_PASS.defaults });

  return (
    <CalcShell
      inputs={
        <>
          <FieldGrid
            field={field}
            fields={BATTLE_PASS_FIELDS.map(({ key, range }) => ({ key, label: t(`fields.${key}`), ...range }))}
            values={values}
          />
          <BattlesPerDayField
            {...BATTLE_PASS.battlesPerDayRange}
            label={t('battlesPerDay')}
            value={values.battlesPerDay}
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
