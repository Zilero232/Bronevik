'use client';

import { useTranslations } from 'next-intl';

import { QueryState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { ChartGranularity, ChartMetric } from '../../../config';

import { CHART_GRANULARITIES, CHART_METRICS, HISTORY_CHART } from '../../../config';
import { useChartsTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { HistoryChart } from './components';

import s from './ChartsTab.module.scss';

export const ChartsTab = () => {
  const t = useTranslations('profile.charts');
  const { metric, setMetric, granularity, setGranularity, query } = useChartsTab();

  return (
    <ProfilePanel
      action={
        <SegmentedControl<ChartGranularity>
          aria-label={t('granularityLabel')}
          options={CHART_GRANULARITIES.map((value) => ({ value, label: t(`granularity.${value}`) }))}
          size='sm'
          value={granularity}
          onChange={setGranularity}
        />
      }
      title={t('title')}
    >
      <div className={s.root}>
        <SegmentedControl<ChartMetric>
          aria-label={t('metricLabel')}
          options={CHART_METRICS.map((value) => ({ value, label: t(`metric.${value}`) }))}
          size='sm'
          value={metric}
          onChange={setMetric}
        />
        <QueryState query={query} skeleton={<Skeleton height={HISTORY_CHART.height} shape='block' />}>
          {(series) => <HistoryChart metric={metric} series={series} />}
        </QueryState>
      </div>
    </ProfilePanel>
  );
};
