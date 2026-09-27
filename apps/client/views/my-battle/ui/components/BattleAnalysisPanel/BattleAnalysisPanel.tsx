'use client';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { QueryState, Skeleton } from '@/ui-kit';

import type { BattleAnalysisPanelProps } from './BattleAnalysisPanel.types';

import { MY_BATTLE } from '../../../config';
import { useBattleAnalysis } from '../../../model/hooks';
import { AccuracyCard, BreakdownCard, MistakesCard, MoeCard, ReferenceCard } from './components';

import s from './BattleAnalysisPanel.module.scss';

export const BattleAnalysisPanel = ({ id }: BattleAnalysisPanelProps) => {
  const { query, needsPlus, efficiency, breakdown, rolls, mistakes } = useBattleAnalysis(id);

  if (needsPlus) {
    return <PlusTeaser feature='battleAnalysis' />;
  }

  return (
    <QueryState query={query} skeleton={<Skeleton height={MY_BATTLE.analysisSkeletonHeight} shape='block' />}>
      {({ reference, moe, accuracy }) => (
        <div className={s.root}>
          <ReferenceCard efficiency={efficiency} reference={reference} />
          <div className={s.grid}>
            <BreakdownCard breakdown={breakdown} />
            <MoeCard moe={moe} />
          </div>
          <div className={s.grid}>
            <AccuracyCard accuracy={accuracy} rolls={rolls} />
            <MistakesCard mistakes={mistakes} />
          </div>
        </div>
      )}
    </QueryState>
  );
};
