'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { ResourceMissing } from '@/widgets/resource-missing';

import { BuildProvider } from '../model/context';
import { useBuildData } from '../model/hooks';
import { BuildScreen, BuildSkeleton } from './components';

import s from './BuildPage.module.scss';

export const BuildPage = () => {
  const t = useTranslations('builds.missing');
  const { tank } = useParams<{ tank: string }>();
  const slug = decodeURIComponent(tank);
  const { vehicle, options, isPending, isRetrying, error, refetch } = useBuildData(slug);

  return (
    <div className={s.root}>
      {match({ vehicle, options, isPending, error })
        .with({ vehicle: P.nonNullable, options: P.nonNullable }, ({ vehicle: loadedVehicle, options: loadedOptions }) => (
          <BuildProvider key={loadedVehicle.tankId} options={loadedOptions} vehicle={loadedVehicle}>
            <BuildScreen />
          </BuildProvider>
        ))
        .with({ isPending: true }, () => <BuildSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.tanks.list, label: t('back') }}
            description={t('notFoundDescription', { slug })}
            reason='notFound'
            title={t('notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.tanks.list, label: t('back') }}
            description={t('errorDescription')}
            isRetrying={isRetrying}
            reason='error'
            title={t('errorTitle')}
            onRetry={refetch}
          />
        ))}
    </div>
  );
};
