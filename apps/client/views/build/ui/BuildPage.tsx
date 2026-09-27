'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { ResourceGate } from '@/widgets/site/resource-missing';

import { BuildProvider } from '../model/context';
import { useBuildData } from '../model/hooks';
import { BuildScreen, BuildSkeleton } from './components';

import s from './BuildPage.module.scss';

export const BuildPage = () => {
  const t = useTranslations('builds.missing');
  const { tank } = useParams<{ tank: string }>();
  const slug = decodeURIComponent(tank);
  const query = useBuildData(slug);

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.builds.list, label: t('back') }}
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        notFound={{ title: t('notFoundTitle'), description: t('notFoundDescription', { slug }) }}
        query={query}
        skeleton={<BuildSkeleton />}
      >
        {({ vehicle, options }) => (
          <BuildProvider key={vehicle.tankId} options={options} vehicle={vehicle}>
            <BuildScreen />
          </BuildProvider>
        )}
      </ResourceGate>
    </div>
  );
};
