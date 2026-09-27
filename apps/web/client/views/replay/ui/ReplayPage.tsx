'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { ReplayPageProps } from './ReplayPage.types';

import { useReplayPage } from '../model/hooks';
import { ReplayHeatmap, ReplayOverview, ReplayProvider, ReplayScoreboard, ReplayStatusState, ReplayTimeline } from './components';

import s from './ReplayPage.module.scss';

export const ReplayPage = ({ id }: ReplayPageProps) => {
  const t = useTranslations('replays.detail');
  const query = useReplayPage(id);

  return (
    <div className={s.root}>
      <ResourceGate
        skeleton={
          <div aria-busy className={s.skeleton}>
            <Skeleton height={180} shape='block' />
            <Skeleton height={360} shape='block' />
          </div>
        }
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        query={query}
      >
        {(replay) => (
          <ReplayProvider replay={replay}>
            {replay.status === 'parsed' ? (
              <>
                <ReplayOverview />
                <ReplayScoreboard />
                <div className={s.grid}>
                  <ReplayTimeline />
                  <ReplayHeatmap />
                </div>
              </>
            ) : (
              <ReplayStatusState />
            )}
          </ReplayProvider>
        )}
      </ResourceGate>
    </div>
  );
};
