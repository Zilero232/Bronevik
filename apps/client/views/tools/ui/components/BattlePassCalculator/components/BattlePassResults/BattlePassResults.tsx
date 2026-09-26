'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ProgressBar } from '@/ui-kit';

import type { BattlePassResultsProps } from '../../BattlePassCalculator.types';

import { useBattlePassPlan } from '../../../../../model/hooks';
import { ResultFigure } from '../../../ResultFigure';
import { ResultList } from '../../../ResultList';

export const BattlePassResults = ({ values }: BattlePassResultsProps) => {
  const t = useTranslations('tools.pass');
  const format = useFormatter();
  const { plan, progress, daysLeft, isPaceEnough } = useBattlePassPlan(values);

  return (
    <>
      <ResultFigure
        fallback={t('noPace')}
        hint={t('perDayHint', { days: daysLeft })}
        label={t('perDay')}
        tone={isPaceEnough ? 'good' : 'neutral'}
        value={plan.battlesPerDayNeeded}
      />
      <ProgressBar
        label={t('trackLabel')}
        tone='accent'
        value={progress * 100}
        valueLabel={format.number(progress, { style: 'percent', maximumFractionDigits: 0 })}
      />
      <ResultList
        items={[
          { key: 'pointsLeft', label: t('pointsLeft'), value: format.number(plan.pointsLeft) },
          { key: 'battles', label: t('battlesNeeded'), value: plan.battlesNeeded === null ? '—' : format.number(plan.battlesNeeded) },
          {
            key: 'finish',
            label: t('finish'),
            value: plan.finishDate ? format.dateTime(plan.finishDate, { day: 'numeric', month: 'long' }) : '—',
            tone: plan.isOnTrack ? 'good' : 'bad'
          },
          { key: 'status', label: t('status'), value: plan.isOnTrack ? t('onTrack') : t('behind'), tone: plan.isOnTrack ? 'good' : 'bad' }
        ]}
      />
    </>
  );
};
