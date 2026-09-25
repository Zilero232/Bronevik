'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SegmentedControl } from '@/ui-kit';

import { CHART_GRANULARITIES, CHART_METRICS } from '../../../config';
import { usePlayerHistory } from '../../../model/hooks';
import { TabCard } from '../TabCard';
import { HistoryChart } from './components';

import s from './ChartsTab.module.scss';

type ChartMetric = (typeof CHART_METRICS)[number];
type ChartGranularity = (typeof CHART_GRANULARITIES)[number];

export const ChartsTab = () => {
  const t = useTranslations('profile.charts');

  const [metric, setMetric] = useState<ChartMetric>('wn8');
  const [granularity, setGranularity] = useState<ChartGranularity>('week');

  const { data: series, isPending, isError, isPlaceholderData } = usePlayerHistory({ metric, granularity });

  return (
    <TabCard
      action={
        <SegmentedControl<ChartGranularity>
          aria-label={t('granularityLabel')}
          options={CHART_GRANULARITIES.map((value) => ({ value, label: t(`granularity.${value}`) }))}
          size='sm'
          value={granularity}
          onChange={setGranularity}
        />
      }
      eyebrow={t('eyebrow')}
      title={t('title')}
    >
      <div className={s.root}>
        <div className={s.metrics}>
          <SegmentedControl<ChartMetric>
            aria-label={t('metricLabel')}
            options={CHART_METRICS.map((value) => ({ value, label: t(`metric.${value}`) }))}
            size='sm'
            value={metric}
            onChange={setMetric}
          />
        </div>
        <HistoryChart isError={isError} isLoading={isPending || isPlaceholderData} metric={metric} series={series} />
      </div>
    </TabCard>
  );
};
