'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, ErrorState, KeyFigure, KeyFigures, Skeleton } from '@/ui-kit';

import { useMapRotationPanel } from '../model/hooks';
import { QueueHeatmap, RotationList, StatsFilters } from './components';

import s from './MapRotationPanel.module.scss';

export const MapRotationPanel = () => {
  const t = useTranslations('mapStats');
  const { filters, formatWait, rotation, queue } = useMapRotationPanel();

  return (
    <div className={s.root}>
      <StatsFilters filters={filters} />
      <KeyFigures isFramed>
        <KeyFigure
          hint={rotation.data ? t('figures.battlesHint', { days: rotation.data.windowDays }) : undefined}
          label={t('figures.battles')}
          value={rotation.data?.battles ?? null}
        />
        <KeyFigure label={t('figures.maps')} value={rotation.data ? rotation.rows.length : null} />
        <KeyFigure
          hint={queue.now && queue.data ? t('figures.waitNowHint', { hour: queue.now.hour, timezone: queue.data.timezone }) : undefined}
          label={t('figures.waitNow')}
          value={queue.now?.selected ? formatWait(queue.now.selected.medianSec) : null}
        />
        <KeyFigure
          hint={queue.now?.fastest ? t('figures.fastestHint', { wait: formatWait(queue.now.fastest.medianSec) }) : undefined}
          label={t('figures.fastest')}
          value={queue.now?.fastest ? t('figures.hour', { hour: queue.now.fastest.hour }) : null}
        />
      </KeyFigures>
      <Card padding='none'>
        <CardHeader meta={rotation.data ? t('rotation.meta', { days: rotation.data.windowDays }) : undefined} title={t('rotation.title')} />
        {rotation.isError && (
          <ErrorState
            isCompact
            description={t('rotation.errorDescription')}
            isRetrying={rotation.isRetrying}
            title={t('rotation.errorTitle')}
            onRetry={rotation.retry}
          />
        )}
        {rotation.isPending && <Skeleton className={s.skeleton} height={320} shape='block' />}
        {rotation.data && rotation.rows.length === 0 && (
          <EmptyState isCompact description={t('rotation.emptyDescription')} title={t('rotation.empty')} />
        )}
        {rotation.rows.length > 0 && <RotationList maxShare={rotation.maxShare} rows={rotation.rows} />}
      </Card>
      <Card padding='none'>
        <CardHeader
          meta={queue.data ? t('queue.meta', { days: queue.data.windowDays, timezone: queue.data.timezone }) : undefined}
          title={t('queue.title')}
        />
        {queue.isError && (
          <ErrorState
            isCompact
            description={t('queue.errorDescription')}
            isRetrying={queue.isRetrying}
            title={t('queue.errorTitle')}
            onRetry={queue.retry}
          />
        )}
        {queue.isPending && <Skeleton className={s.skeleton} height={280} shape='block' />}
        {queue.data && queue.heat.rows.length === 0 && <EmptyState isCompact description={t('queue.emptyDescription')} title={t('queue.empty')} />}
        {queue.data && queue.heat.rows.length > 0 && <QueueHeatmap currentHour={queue.data.now.hour} heat={queue.heat} />}
      </Card>
    </div>
  );
};
