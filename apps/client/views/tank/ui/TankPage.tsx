'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { ResourceMissing } from '@/widgets/resource-missing';

import { TankProvider } from '../model/context';
import { useTankDetail } from '../model/hooks';
import {
  EconomySection,
  HowToBuild,
  LearningSection,
  MarksSection,
  MasteryPanel,
  ObtainSection,
  PatchHistory,
  ServerStats,
  TankGarage,
  TankSkeleton,
  TopPlayers
} from './components';

import s from './TankPage.module.scss';

export const TankPage = () => {
  const t = useTranslations('tank.missing');
  const ts = useTranslations('tank');
  const { slug } = useParams<{ slug: string }>();
  const { data: detail, isPending, error, refetch } = useTankDetail();

  return (
    <div className={s.root}>
      {match({ detail, isPending, error })
        .with({ detail: P.nonNullable }, ({ detail: loaded }) => (
          <TankProvider detail={loaded}>
            <TankGarage />
            <ServerStats />
            <div className={s.pair}>
              <MarksSection />
              <MasteryPanel />
            </div>
            <div className={s.pair}>
              <EconomySection />
              <ObtainSection />
            </div>
            <LearningSection />
            <TopPlayers />
            <HowToBuild />
            <PatchHistory />
            <p className={s.source}>{ts('source')}</p>
          </TankProvider>
        ))
        .with({ isPending: true }, () => <TankSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.tanks, label: t('back') }}
            description={t('notFound.description', { slug: decodeURIComponent(slug) })}
            reason='notFound'
            title={t('notFound.title')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.tanks, label: t('back') }}
            description={t('error.description', { slug: decodeURIComponent(slug) })}
            reason='error'
            title={t('error.title')}
            onRetry={() => void refetch()}
          />
        ))}
    </div>
  );
};
