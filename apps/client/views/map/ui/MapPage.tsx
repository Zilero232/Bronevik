'use client';

import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import { useMapDetail } from '../model/hooks';
import { MapMissing, MapSkeleton, MapView } from './components';

import s from './MapPage.module.scss';

export const MapPage = () => {
  const { id } = useParams<{ id: string }>();
  const mapId = decodeURIComponent(id);
  const { data: map, isPending, error, refetch } = useMapDetail(mapId);

  return (
    <div className={s.root}>
      {match({ map, isPending, error })
        .with({ map: P.nonNullable }, ({ map: loaded }) => <MapView map={loaded} />)
        .with({ isPending: true }, () => <MapSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => <MapMissing id={mapId} reason='notFound' />)
        .otherwise(() => (
          <MapMissing id={mapId} reason='error' onRetry={() => refetch()} />
        ))}
    </div>
  );
};
