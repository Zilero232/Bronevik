'use client';

import { MapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';
import { MapSamplesTable } from '@/widgets/map/map-samples';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { useTankMaps } from '../../../model/hooks';
import { TankSection } from '../TankSection';

import s from './TankMaps.module.scss';

export const TankMaps = () => {
  const t = useTranslations('tank.maps');
  const { query } = useTankMaps();

  return (
    <TankSection id={TANK_SECTIONS.maps} meta={t('meta')} title={t('title')}>
      <div className={s.body}>
        <QueryState
          empty={
            <EmptyState description={t('emptyDescription')} icon={<MapIcon size={TANK_PAGE.emptyIcon} strokeWidth={1.5} />} title={t('emptyTitle')} />
          }
          skeleton={
            <div className={s.skeleton}>
              <Skeleton width='45%' />
              <Skeleton count={TANK_PAGE.skeletonRows + 1} height={TANK_PAGE.rowHeight} shape='block' width='100%' />
            </div>
          }
          isEmpty={({ rows }) => rows.length === 0}
          query={query}
        >
          {({ rows, windowDays, minBattles }) => <MapSamplesTable minBattles={minBattles} nameLabel={t('map')} rows={rows} windowDays={windowDays} />}
        </QueryState>
      </div>
    </TankSection>
  );
};
