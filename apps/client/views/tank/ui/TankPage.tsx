'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { useRouteParam } from '@/shared/lib';
import { ResourceGate } from '@/widgets/site/resource-missing';

import { TankProvider } from '../model/context';
import { useTankDetail } from '../model/hooks';
import {
  BestBattles,
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
  SimilarTanks,
  TankGarage,
  TankSkeleton,
  TopPlayers
} from './components';

import s from './TankPage.module.scss';

export const TankPage = () => {
  const t = useTranslations('tank.missing');
  const ts = useTranslations('tank');
  const name = useRouteParam('slug');
  const query = useTankDetail();

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.tanks.list, label: t('back') }}
        className={s.shell}
        error={{ title: t('error.title'), description: t('error.description', { slug: name }) }}
        notFound={{ title: t('notFound.title'), description: t('notFound.description', { slug: name }) }}
        query={query}
        skeleton={<TankSkeleton />}
      >
        {(detail) => (
          <TankProvider detail={detail}>
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
              <div className={s.pair}>
                <PatchHistory />
                <BestBattles />
              </div>
              <SimilarTanks />
              <p className={s.source}>{ts('source')}</p>
            </div>
          </TankProvider>
        )}
      </ResourceGate>
    </div>
  );
};
