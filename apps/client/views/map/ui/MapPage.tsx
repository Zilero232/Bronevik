'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import { useMapDetail } from '../model/hooks';
import { MapHeader, MapNav, MapSkeleton, MapStats } from './components';

import s from './MapPage.module.scss';

export const MapPage = () => {
  const t = useTranslations('maps.missing');
  const { id } = useParams<{ id: string }>();
  const mapId = decodeURIComponent(id);
  const query = useMapDetail(mapId);

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.maps.list, label: t('toMaps') }}
        error={{ title: t('errorTitle'), description: t('errorDescription', { id: mapId }) }}
        notFound={{ title: t('notFoundTitle'), description: t('notFoundDescription', { id: mapId }) }}
        query={query}
        skeleton={<MapSkeleton />}
      >
        {(map) => (
          <>
            <MapHeader map={map} />
            <MapStats stats={map.stats} />
            <MapNav arenaId={map.arenaId} />
            <DataSourceNote />
          </>
        )}
      </ResourceGate>
    </div>
  );
};
