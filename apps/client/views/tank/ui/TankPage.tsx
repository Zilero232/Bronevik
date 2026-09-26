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
  MathSection,
  ObtainSection,
  PatchHistory,
  SectionNav,
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
            <SectionNav />
            <div className={s.shell}>
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
              <HowToBuild />
              <MathSection />
            </div>
            <TopPlayers />
            <div className={s.shell}>
              <PatchHistory />
              <p className={s.source}>{ts('source')}</p>
            </div>
          </TankProvider>
        ))
        .with({ isPending: true }, () => (
          <div className={s.shell}>
            <TankSkeleton />
          </div>
        ))
        .with({ error: P.when(isNotFoundError) }, () => (
          <div className={s.shell}>
            <ResourceMissing
              back={{ href: ROUTES.tanks.list, label: t('back') }}
              description={t('notFound.description', { slug: decodeURIComponent(slug) })}
              reason='notFound'
              title={t('notFound.title')}
            />
          </div>
        ))
        .otherwise(() => (
          <div className={s.shell}>
            <ResourceMissing
              back={{ href: ROUTES.tanks.list, label: t('back') }}
              description={t('error.description', { slug: decodeURIComponent(slug) })}
              reason='error'
              title={t('error.title')}
              onRetry={() => void refetch()}
            />
          </div>
        ))}
    </div>
  );
};
