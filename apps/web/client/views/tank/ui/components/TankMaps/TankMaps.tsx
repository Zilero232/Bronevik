'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';
import { MapSamplesTable } from '@/widgets/map/map-samples';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { useTankMaps } from '../../../model/hooks';

import s from './TankMaps.module.scss';

export const TankMaps = () => {
  const t = useTranslations('tank.maps');
  const { query } = useTankMaps();

  return (
    <Card className={s.root} id={TANK_SECTIONS.maps} padding='none'>
      <CardHeader className={s.header} meta={t('meta')} title={t('title')} />
      <div className={s.body}>
        <QueryState
          empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
          isEmpty={({ rows }) => rows.length === 0}
          query={query}
          skeleton={<Skeleton height={TANK_PAGE.skeletonRows * TANK_PAGE.rowHeight} shape='block' width='100%' />}
        >
          {({ rows, windowDays, minBattles }) => <MapSamplesTable minBattles={minBattles} nameLabel={t('map')} rows={rows} windowDays={windowDays} />}
        </QueryState>
      </div>
    </Card>
  );
};
