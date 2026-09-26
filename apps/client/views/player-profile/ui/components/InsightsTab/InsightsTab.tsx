'use client';

import type { InsightsPeriod } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { PLAYTIME } from '../../../config';
import { useInsightsTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { GroupBreakdown, InsightTips, PlaytimeCard, TankInsightList } from './components';

import s from './InsightsTab.module.scss';

export const InsightsTab = () => {
  const t = useTranslations('profile.insights');
  const tPeriods = useTranslations('periods');
  const { period, setPeriod, periodOptions, insights, isEmpty, isPending, isError, isRetrying, retry } = useInsightsTab();

  return (
    <div className={s.root}>
      <ProfilePanel
        action={
          <SegmentedControl<InsightsPeriod> aria-label={tPeriods('label')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
        }
        title={t('title')}
      >
        {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
        {isPending && <Skeleton height={PLAYTIME.skeletonHeight} shape='block' />}
        {isEmpty && <EmptyState isCompact title={t('empty')} />}
        {insights && (
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
      </ProfilePanel>
      <PlaytimeCard />
    </div>
  );
};
