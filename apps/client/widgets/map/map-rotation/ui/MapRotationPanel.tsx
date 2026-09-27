'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, QueryState, Skeleton } from '@/ui-kit';

import { useMapRotationPanel } from '../model/hooks';
import { QueueHeatmap, RotationList, StatsFilters } from './components';

import s from './MapRotationPanel.module.scss';

export const MapRotationPanel = () => {
  const t = useTranslations('mapStats');
  const { rotation, queue, figures, rotationMeta, queueMeta } = useMapRotationPanel();

  return (
    <div className={s.root}>
      <StatsFilters />
      <KeyFigures isFramed>
        <KeyFigure hint={figures.battlesHint} label={t('figures.battles')} value={figures.battles} />
        <KeyFigure label={t('figures.maps')} value={figures.maps} />
        <KeyFigure hint={figures.waitNowHint} label={t('figures.waitNow')} value={figures.waitNow} />
        <KeyFigure hint={figures.fastestHint} label={t('figures.fastest')} value={figures.fastest} />
      </KeyFigures>
      <Card padding='none'>
        <CardHeader meta={rotationMeta} title={t('rotation.title')} />
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
        <CardHeader meta={queueMeta} title={t('queue.title')} />
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
