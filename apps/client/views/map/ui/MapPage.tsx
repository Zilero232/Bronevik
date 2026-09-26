'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { ResourceMissing } from '@/widgets/resource-missing';

import { useMapDetail } from '../model/hooks';
import { MapSkeleton, MapView } from './components';

import s from './MapPage.module.scss';

export const MapPage = () => {
  const t = useTranslations('maps.missing');
  const { id } = useParams<{ id: string }>();
  const mapId = decodeURIComponent(id);
  const { data: map, isPending, isFetching, error, refetch } = useMapDetail(mapId);

  return (
    <div className={s.root}>
      {match({ map, isPending, error })
        .with({ map: P.nonNullable }, ({ map: loaded }) => <MapView map={loaded} />)
        .with({ isPending: true }, () => <MapSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.maps, label: t('toMaps') }}
            description={t('notFoundDescription', { id: mapId })}
            reason='notFound'
            title={t('notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.maps, label: t('toMaps') }}
            description={t('errorDescription', { id: mapId })}
            isRetrying={isFetching}
            reason='error'
            title={t('errorTitle')}
            onRetry={() => void refetch()}
          />
        ))}
    </div>
  );
};
