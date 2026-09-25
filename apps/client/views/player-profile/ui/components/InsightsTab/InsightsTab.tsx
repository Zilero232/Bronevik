'use client';

import type { InsightsPeriod, PlayerInsights } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SegmentedControl, Skeleton } from '@/ui-kit';

import { PROFILE_PERIODS } from '../../../config';
import { usePlayerInsights } from '../../../model/hooks';
import { TabCard } from '../TabCard';
import { TabState } from '../TabState';
import { GroupBreakdown, InsightTips, PlaytimeCard, TankInsightList } from './components';

import s from './InsightsTab.module.scss';

const hasInsights = ({ tips, byClass, byTier, weakTanks, strongTanks }: PlayerInsights) =>
  [tips, byClass, byTier, weakTanks, strongTanks].some((list) => list.length > 0);

export const InsightsTab = () => {
  const t = useTranslations('profile.insights');
  const tProfile = useTranslations('profile');
  const tPeriods = useTranslations('periods');

  const [period, setPeriod] = useState<InsightsPeriod>('overall');

  const { data: insights, isPending, isError } = usePlayerInsights(period);

  const options = PROFILE_PERIODS.map((value) => ({ value, label: value === 'overall' ? tProfile('overall') : tPeriods(value) }));

  return (
    <div className={s.root}>
      <TabCard
        action={<SegmentedControl<InsightsPeriod> aria-label={tPeriods('label')} options={options} size='sm' value={period} onChange={setPeriod} />}
        eyebrow={t('eyebrow')}
        title={t('title')}
      >
        {isError && <TabState kind='error' />}
        {isPending && <Skeleton height={360} shape='block' />}
        {insights && !hasInsights(insights) && <TabState kind='empty' />}
        {insights && hasInsights(insights) && (
          <div className={s.body}>
            <InsightTips insights={insights} />
            <div className={s.pair}>
              <GroupBreakdown groups={insights.byClass} kind='class' />
              <GroupBreakdown groups={insights.byTier} kind='tier' />
            </div>
            <div className={s.pair}>
              <TankInsightList kind='weak' tanks={insights.weakTanks} />
              <TankInsightList kind='strong' tanks={insights.strongTanks} />
            </div>
          </div>
        )}
      </TabCard>
      <PlaytimeCard />
    </div>
  );
};
