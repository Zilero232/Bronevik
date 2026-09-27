'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { StreamerPageProps } from './StreamerPage.types';

import { StreamerProvider } from '../model/context';
import { useStreamerPage } from '../model/hooks';
import { ClaimBanner, LatestVideos, LiveBlock, StreamerHero, StreamerStats } from './components';

import s from './StreamerPage.module.scss';

export const StreamerPage = ({ slug }: StreamerPageProps) => {
  const t = useTranslations('streamer.page');
  const query = useStreamerPage(slug);

  return (
    <div className={s.root}>
      <ResourceGate
        skeleton={
          <div aria-busy className={s.skeleton}>
            <Skeleton height={280} shape='block' />
            <Skeleton height={140} shape='block' />
          </div>
        }
        error={{ title: t('errorTitle'), description: t('errorDescription') }}
        query={query}
      >
        {(profile) => (
          <StreamerProvider profile={profile}>
            <StreamerHero />
            {profile.kind === 'editorial' && <ClaimBanner />}
            {profile.live && <LiveBlock live={profile.live} />}
            {profile.accountId !== null && <StreamerStats accountId={profile.accountId} />}
            {profile.latestVideos.length > 0 && <LatestVideos videos={profile.latestVideos} />}
          </StreamerProvider>
        )}
      </ResourceGate>
    </div>
  );
};
