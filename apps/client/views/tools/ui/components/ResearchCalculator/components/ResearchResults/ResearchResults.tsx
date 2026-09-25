'use client';

import { Coins, Crosshair } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ProgressBar } from '@/ui-kit';

import type { ResearchResultsProps } from '../../ResearchCalculator.types';

import { researchPlan } from '../../../../../lib/research-plan';
import { ResultFigure, ResultList } from '../../../CalcKit';

export const ResearchResults = ({ vehicle, cost, values }: ResearchResultsProps) => {
  const t = useTranslations('tools.research');
  const format = useFormatter();

  const plan = researchPlan({ ...values, cost: cost ?? { xp: 0, credits: 0 } });
  const battlesText = (battles: number | null) => (battles === null ? '—' : format.number(battles));

  return match({ vehicle, cost })
    .with({ vehicle: null }, () => <EmptyState description={t('pickDescription')} icon={<Crosshair size={28} />} title={t('pickTitle')} />)
    .with({ vehicle: { isPremium: true } }, () => (
      <EmptyState description={t('premiumTankHint')} icon={<Coins size={28} />} title={t('premiumTank')} />
    ))
    .otherwise(() => (
      <>
        <ResultFigure
          fallback={t('noIncome')}
          hint={plan.days === null ? undefined : t('days', { count: plan.days, perDay: values.battlesPerDay })}
          label={t('battles')}
          value={plan.battles}
        />
        <ProgressBar
          label={t('progress')}
          tone='accent'
          value={plan.progress * 100}
          valueLabel={`${format.number(plan.progress * 100, { maximumFractionDigits: 0 })}%`}
        />
        <ResultList
          items={[
            {
              key: 'cost',
              label: t('cost'),
              value: t('costValue', { xp: format.number(cost?.xp ?? 0), credits: format.number(cost?.credits ?? 0) })
            },
            { key: 'xpLeft', label: t('xpLeft'), value: format.number(plan.xpLeft), tone: plan.xpLeft === 0 ? 'good' : undefined },
            {
              key: 'creditsLeft',
              label: t('creditsLeft'),
              value: format.number(plan.creditsLeft),
              tone: plan.creditsLeft === 0 ? 'good' : undefined
            },
            { key: 'battlesForXp', label: t('battlesForXp'), value: battlesText(plan.battlesForXp) },
            { key: 'battlesForCredits', label: t('battlesForCredits'), value: battlesText(plan.battlesForCredits) },
            { key: 'source', label: t('source'), value: t(`sources.${cost?.source ?? 'tier'}`) }
          ]}
        />
      </>
    ));
};
