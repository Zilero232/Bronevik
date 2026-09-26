'use client';

import { Crosshair } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BarChart, Card, CardHeader, DataTable, EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import { ANALYTICS_VIEW } from '../../../config';
import { useAnalyticsRng } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';
import { ModEmptyState } from '../ModEmptyState';

import s from './RngTab.module.scss';

export const RngTab = () => {
  const t = useTranslations('analytics.rng');
  const rng = useAnalyticsRng();

  return (
    <AnalyticsState data={rng.data} feature='battleAnalysis' isRetrying={rng.isRetrying} status={rng.status} onRetry={rng.retry}>
      {(data) =>
        rng.isEmpty ? (
          <ModEmptyState description={t('emptyText')} title={t('emptyTitle')} />
        ) : (
          <div className={s.root}>
            <KeyFigures>
              <KeyFigure label={t('shots')} tone='steel' value={data.shots} />
              <KeyFigure format={{ signDisplay: 'exceptZero', maximumFractionDigits: 1 }} label={t('meanRoll')} suffix='%' value={rng.meanRoll} />
              <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('withinSpread')} suffix='%' tone='steel' value={data.withinSpread} />
              <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('hitRate')} suffix='%' tone='steel' value={data.accuracy.hitRate} />
              <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('penRate')} suffix='%' tone='steel' value={data.accuracy.penRate} />
            </KeyFigures>
            <Card padding='none'>
              <CardHeader meta={t('chartDescription')} title={t('chartTitle')} />
              <div className={s.chart}>
                <BarChart
                  ariaLabel={t('chartTitle')}
                  formatValue={rng.formatPercent}
                  height={ANALYTICS_VIEW.chartHeight}
                  labels={rng.chart.labels}
                  series={rng.chart.series}
                />
              </div>
            </Card>
            <Card padding='none'>
              <CardHeader title={t('distanceTitle')} />
              <DataTable
                caption={t('distanceTitle')}
                columns={rng.columns}
                data={data.distance}
                density='compact'
                emptyState={<EmptyState description={t('distanceEmptyText')} icon={<Crosshair size={16} />} title={t('distanceEmpty')} />}
                getRowId={(row) => String(row.from)}
              />
            </Card>
          </div>
        )
      }
    </AnalyticsState>
  );
};
