'use client';

import type { AnalyticsGranularity } from '@otmetki/schemas';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, LineChart, SectionHeader, SegmentedControl } from '@/ui-kit';

import type { TankTrendProps } from './TankTrend.types';

import { ANALYTICS_VIEW } from '../../../config';
import { useAnalyticsTank } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';
import { AnalyticsToolbar } from '../AnalyticsToolbar';
import { TrendPanel } from '../TrendPanel';

import s from './TankTrend.module.scss';

export const TankTrend = ({ tankId }: TankTrendProps) => {
  const t = useTranslations('analytics.tank');
  const tank = useAnalyticsTank(tankId);

  return (
    <div className={s.root}>
      <Link className={s.back} href={ROUTES.account.analytics}>
        <ArrowLeft aria-hidden size={14} />
        {t('back')}
      </Link>
      <SectionHeader
        action={
          <div className={s.toolbar}>
            <AnalyticsToolbar isPeriodVisible={false} />
            <TankPicker className={s.picker} placeholder={t('pick')} value={tank.vehicle} onChange={tank.onTankChange} />
            <SegmentedControl<AnalyticsGranularity>
              aria-label={t('granularity.label')}
              options={tank.granularityOptions}
              size='sm'
              value={tank.granularity}
              onChange={tank.setGranularity}
            />
          </div>
        }
        as='h2'
        description={t('description')}
        title={tank.vehicle ? t('title', { name: tank.vehicle.name }) : t('titleFallback')}
      />
      <AnalyticsState data={tank.data} isRetrying={tank.isRetrying} status={tank.status} onRetry={tank.retry}>
        {(data) =>
          tank.isEmpty ? (
            <EmptyState description={t('emptyText')} title={t('empty')} />
          ) : (
            <div className={s.body}>
              <KeyFigures>
                <KeyFigure label={t('battles')} tone='steel' value={data.totals.battles} />
                <KeyFigure
                  format={{ maximumFractionDigits: 2 }}
                  label={t('winRate')}
                  suffix='%'
                  tone={tank.tones.winRate}
                  value={data.totals.winRate}
                />
                <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('avgDamage')} tone='steel' value={data.totals.avgDamage} />
                <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('wn8')} tone={tank.tones.wn8} value={data.totals.wn8} />
                <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('survivalRate')} suffix='%' tone='steel' value={data.totals.survivalRate} />
              </KeyFigures>
              <TrendPanel
                damage={tank.damageSeries}
                formatNumber={tank.formatNumber}
                formatPercent={tank.formatPercent}
                labels={tank.labels}
                winRate={tank.winRateSeries}
                wn8={tank.wn8Series}
              />
              <Card padding='none'>
                <CardHeader title={t('moeTitle')} />
                {tank.moeLabels.length > 1 ? (
                  <div className={s.chart}>
                    <LineChart
                      withArea
                      ariaLabel={t('moe')}
                      formatValue={tank.formatPercent}
                      height={ANALYTICS_VIEW.chartHeight}
                      labels={tank.moeLabels}
                      series={tank.moeSeries}
                    />
                  </div>
                ) : (
                  <EmptyState isCompact title={t('moeEmpty')} />
                )}
              </Card>
            </div>
          )
        }
      </AnalyticsState>
    </div>
  );
};
