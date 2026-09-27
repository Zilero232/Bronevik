'use client';

import type { InsightsPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, SegmentedControl, Skeleton } from '@/ui-kit';

import { PLAYTIME } from '../../../config';
import { hasInsights } from '../../../lib/has-insights';
import { useInsightsTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { GroupBreakdown, InsightTips, PlaytimeCard, TankInsightList } from './components';

import s from './InsightsTab.module.scss';

export const InsightsTab = () => {
  const t = useTranslations('profile.insights');
  const tPeriods = useTranslations('periods');
  const { period, setPeriod, periodOptions, query } = useInsightsTab();

  return (
    <div className={s.root}>
      <ProfilePanel
        action={
          <SegmentedControl<InsightsPeriod> aria-label={tPeriods('label')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
        }
        title={t('title')}
      >
        <QueryState
          isCompact
          empty={<EmptyState isCompact title={t('empty')} />}
          isEmpty={(insights) => !hasInsights(insights)}
          query={query}
          skeleton={<Skeleton height={PLAYTIME.skeletonHeight} shape='block' />}
        >
          {(insights) => (
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
        </QueryState>
      </ProfilePanel>
      <PlaytimeCard />
    </div>
  );
};
