'use client';

import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import { TankProvider } from '../model/context';
import { useTankDetail } from '../model/hooks';
import { MarksSection, PatchHistory, PopularBuilds, ServerStats, TankHero, TankMissing, TankSkeleton, TopPlayers } from './components';

import s from './TankPage.module.scss';

export const TankPage = () => {
  const { data: detail, isPending, error } = useTankDetail();

  return (
    <div className={s.root}>
      {match({ detail, isPending, error })
        .with({ detail: P.nonNullable }, ({ detail: loaded }) => (
          <TankProvider detail={loaded}>
            <TankHero />
            <div className={s.sections}>
              <ServerStats />
              <MarksSection />
              <TopPlayers />
              <PopularBuilds />
              <PatchHistory />
            </div>
          </TankProvider>
        ))
        .with({ isPending: true }, () => <TankSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => <TankMissing reason='notFound' />)
        .otherwise(() => (
          <TankMissing reason='error' />
        ))}
    </div>
  );
};
