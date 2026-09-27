'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, QueryState, Skeleton } from '@/ui-kit';

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
        <KeyFigure label={t('figures.maps')} value={rotation.data?.rows.length ?? null} />
        <KeyFigure
          hint={queue.data ? t('figures.waitNowHint', { hour: queue.data.now.hour, timezone: queue.data.timezone }) : undefined}
          label={t('figures.waitNow')}
          value={queue.data?.now.selected ? formatWait(queue.data.now.selected.medianSec) : null}
        />
        <KeyFigure
          hint={queue.data?.now.fastest ? t('figures.fastestHint', { wait: formatWait(queue.data.now.fastest.medianSec) }) : undefined}
          label={t('figures.fastest')}
          value={queue.data?.now.fastest ? t('figures.hour', { hour: queue.data.now.fastest.hour }) : null}
        />
      </KeyFigures>
      <Card padding='none'>
        <CardHeader meta={rotation.data ? t('rotation.meta', { days: rotation.data.windowDays }) : undefined} title={t('rotation.title')} />
        <QueryState
          isCompact
          empty={<EmptyState isCompact description={t('rotation.emptyDescription')} title={t('rotation.empty')} />}
          errorDescription={t('rotation.errorDescription')}
          errorTitle={t('rotation.errorTitle')}
          isEmpty={({ rows }) => rows.length === 0}
          query={rotation}
          skeleton={<Skeleton className={s.skeleton} height={320} shape='block' />}
        >
          {({ rows, maxShare }) => <RotationList maxShare={maxShare} rows={rows} />}
        </QueryState>
      </Card>
      <Card padding='none'>
        <CardHeader
          meta={queue.data ? t('queue.meta', { days: queue.data.windowDays, timezone: queue.data.timezone }) : undefined}
          title={t('queue.title')}
        />
        <QueryState
          isCompact
          empty={<EmptyState isCompact description={t('queue.emptyDescription')} title={t('queue.empty')} />}
          errorDescription={t('queue.errorDescription')}
          errorTitle={t('queue.errorTitle')}
          isEmpty={({ heat }) => heat.rows.length === 0}
          query={queue}
          skeleton={<Skeleton className={s.skeleton} height={280} shape='block' />}
        >
          {({ now, heat }) => <QueueHeatmap currentHour={now.hour} heat={heat} />}
        </QueryState>
      </Card>
    </div>
  );
};
