'use client';

import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import { BuildProvider } from '../model/context';
import { useBuildData } from '../model/hooks';
import { BuildMissing, BuildSkeleton, BuildWorkspace } from './components';

import s from './BuildPage.module.scss';

export const BuildPage = () => {
  const { tank } = useParams<{ tank: string }>();
  const slug = decodeURIComponent(tank);
  const { vehicle, options, isPending, error } = useBuildData(slug);

  return (
    <div className={s.root}>
      {match({ vehicle, options, isPending, error })
        .with({ vehicle: P.nonNullable, options: P.nonNullable }, ({ vehicle: loadedVehicle, options: loadedOptions }) => (
          <BuildProvider key={loadedVehicle.tankId} options={loadedOptions} vehicle={loadedVehicle}>
            <BuildWorkspace />
          </BuildProvider>
        ))
        .with({ isPending: true }, () => <BuildSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => <BuildMissing reason='notFound' slug={slug} />)
        .otherwise(() => (
          <BuildMissing reason='error' slug={slug} />
        ))}
    </div>
  );
};
