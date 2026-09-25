'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { BattlePassResultsProps } from '../../BattlePassCalculator.types';

import { battlePassPlan } from '../../../../../lib/battle-pass';
import { useToday } from '../../../../../model/hooks';
import { ResultFigure, ResultList } from '../../../CalcKit';
import { PassTrack } from '../PassTrack';

export const BattlePassResults = ({ values }: BattlePassResultsProps) => {
  const t = useTranslations('tools.pass');
  const format = useFormatter();
  const today = useToday();

  const stages = values.stages ?? 0;
  const daysLeft = values.daysLeft ?? 0;
  const plan = battlePassPlan({
    stage: values.stage ?? 0,
    stagePoints: values.stagePoints ?? 0,
    pointsPerStage: values.pointsPerStage ?? 0,
    stages,
    daysLeft,
    pointsPerBattle: values.pointsPerBattle ?? 0,
    battlesPerDay: values.battlesPerDay,
    today
  });

  const { finishDate, isOnTrack } = plan;
  const finish = finishDate ? format.dateTime(finishDate, { day: 'numeric', month: 'long' }) : '—';

  return (
    <>
      <PassTrack progress={plan.progress} stages={stages} />
      <ResultFigure
        fallback={t('noPace')}
        hint={t('perDayHint', { days: daysLeft })}
        label={t('perDay')}
        tone={plan.battlesPerDayNeeded !== null && plan.battlesPerDayNeeded <= values.battlesPerDay ? 'good' : 'accent'}
        value={plan.battlesPerDayNeeded}
      />
      <ResultList
        items={[
          { key: 'pointsLeft', label: t('pointsLeft'), value: format.number(plan.pointsLeft) },
          { key: 'battles', label: t('battlesNeeded'), value: plan.battlesNeeded === null ? '—' : format.number(plan.battlesNeeded) },
          { key: 'finish', label: t('finish'), value: finish, tone: isOnTrack ? 'good' : 'bad' },
          { key: 'status', label: t('status'), value: isOnTrack ? t('onTrack') : t('behind'), tone: isOnTrack ? 'good' : 'bad' }
        ]}
      />
    </>
  );
};
