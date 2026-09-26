'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { ChartGranularity, ChartMetric } from '../../../config';

import { CHART_GRANULARITIES, CHART_METRICS } from '../../../config';
import { useChartsTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { HistoryChart } from './components';

import s from './ChartsTab.module.scss';

export const ChartsTab = () => {
  const t = useTranslations('profile.charts');
  const { metric, setMetric, granularity, setGranularity, series, isLoading, isError, isRetrying, retry } = useChartsTab();

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
        <HistoryChart isError={isError} isLoading={isLoading} isRetrying={isRetrying} metric={metric} series={series} onRetry={retry} />
      </div>
    </ProfilePanel>
  );
};
