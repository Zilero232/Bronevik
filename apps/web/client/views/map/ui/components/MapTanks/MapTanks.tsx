'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, QueryState } from '@/ui-kit';
import { MapSamplesTable } from '@/widgets/map/map-samples';

import type { MapTanksProps } from './MapTanks.types';

import { useMapTanks } from '../../../model/hooks';

export const MapTanks = ({ arenaId }: MapTanksProps) => {
  const t = useTranslations('maps.map.tanks');
  const { query } = useMapTanks(arenaId);

  return (
    <Card padding='md'>
      <CardHeader meta={t('meta')} title={t('title')} />
      <QueryState
        empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        isEmpty={({ rows }) => rows.length === 0}
        query={query}
        skeleton={<MapSamplesTable isLoading minBattles={0} nameLabel={t('tank')} rows={[]} windowDays={0} />}
      >
        {({ rows, windowDays, minBattles }) => <MapSamplesTable minBattles={minBattles} nameLabel={t('tank')} rows={rows} windowDays={windowDays} />}
      </QueryState>
    </Card>
  );
};
