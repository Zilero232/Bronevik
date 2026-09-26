'use client';

import { useTranslations } from 'next-intl';

import { AreaChart, Card, CardHeader, DataSourceNote, EmptyState, ErrorState, KeyFigure, KeyFigures, PageHeader, Skeleton } from '@/ui-kit';
import { QueueNowCard } from '@/widgets/map/map-rotation';

import { usePulseView } from '../model/hooks';
import { HeatGrid } from './components';

import s from './PulsePage.module.scss';

export const PulsePage = () => {
  const t = useTranslations('pulse');
  const view = usePulseView();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      {view.isError && <ErrorState description={t('error.description')} isRetrying={view.isRetrying} title={t('error.title')} onRetry={view.retry} />}
      {view.isPending && <Skeleton height={320} shape='block' />}
      {view.pulse && (
        <>
          <KeyFigures isFramed>
            <KeyFigure hint={t('figures.activeHint')} label={t('figures.active')} value={view.pulse.activePlayers} />
            <KeyFigure hint={t('figures.trackedHint')} label={t('figures.tracked')} value={view.pulse.trackedPlayers} />
            <KeyFigure hint={t('figures.peakHint', { timezone: view.pulse.timezone })} label={t('figures.peak')} suffix=':00' value={view.peakHour} />
            <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('figures.peakShare')} suffix='%' value={view.peakShare} />
          </KeyFigures>
          <Card padding='none'>
            <CardHeader meta={t('heat.meta', { timezone: view.pulse.timezone })} title={t('heat.title')} />
            {view.heat.total === 0 ? <EmptyState isCompact title={t('heat.empty')} /> : <HeatGrid rows={view.heat.rows} />}
          </Card>
          <QueueNowCard />
          <Card padding='none'>
            <CardHeader meta={t('series.meta')} title={t('series.title')} />
            {view.series.values.length > 1 ? (
              <div className={s.chart}>
                <AreaChart
                  ariaLabel={t('series.title')}
                  height={220}
                  labels={view.series.labels}
                  series={[{ id: 'players', label: t('series.players'), values: view.series.values, tone: 'accent' }]}
                />
              </div>
            ) : (
              <EmptyState isCompact title={t('series.empty')} />
            )}
          </Card>
          <DataSourceNote updatedAt={view.pulse.computedAt} />
        </>
      )}
    </div>
  );
};
