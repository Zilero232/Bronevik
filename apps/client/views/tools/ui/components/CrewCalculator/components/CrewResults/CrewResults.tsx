'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { BarChart } from '@/ui-kit';

import type { CrewResultsProps } from '../../CrewCalculator.types';

import { TOOLS_LAYOUT } from '../../../../../config';
import { crewPlan } from '../../../../../lib/crew-xp';
import { ResultFigure, ResultList } from '../../../CalcKit';

export const CrewResults = ({ values }: CrewResultsProps) => {
  const t = useTranslations('tools.crew');
  const format = useFormatter();

  const { skill, percent, xpPerBattle, bookXp, premium, accelerated, reserve } = values;
  const plan = crewPlan({ skill, percent, xpPerBattle: xpPerBattle ?? 0, bookXp: bookXp ?? 0, bonuses: { premium, accelerated, reserve } });

  return (
    <>
      <ResultFigure
        fallback={t('noXp')}
        hint={t('battlesHint', { skill })}
        label={t('battles')}
        tone={plan.battles === 0 ? 'good' : 'accent'}
        value={plan.battles}
      />
      <ResultList
        items={[
          { key: 'xpLeft', label: t('xpLeft'), value: format.number(plan.xpLeft) },
          {
            key: 'perBattle',
            label: t('perBattle'),
            value: format.number(Math.round(plan.perBattle)),
            tone: plan.perBattle > (xpPerBattle ?? 0) ? 'good' : undefined
          }
        ]}
      />
      <BarChart
        ariaLabel={t('upcomingAria')}
        formatValue={(value) => format.number(value)}
        height={TOOLS_LAYOUT.chartHeight}
        labels={plan.upcoming.map((item) => t('skillValue', { skill: item.skill }))}
        series={[{ id: 'battles', label: t('upcomingSeries'), values: plan.upcoming.map((item) => item.battles ?? 0), tone: 'steel' }]}
      />
    </>
  );
};
