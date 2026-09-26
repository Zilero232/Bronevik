'use client';

import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { Button, EmptyState, Skeleton } from '@/ui-kit';

import type { StreamerPageProps } from './StreamerPage.types';

import { useStreamerPage } from '../model/hooks';
import { ClaimBanner, LatestVideos, LiveBlock, StreamerHero, StreamerStats } from './components';

import s from './StreamerPage.module.scss';

export const StreamerPage = ({ slug }: StreamerPageProps) => {
  const t = useTranslations('streamer.page');
  const { data: profile, channels, isPending, error, refetch } = useStreamerPage(slug);

  return (
    <div className={s.root}>
      {match({ profile, isPending, error })
        .with({ profile: P.nonNullable }, ({ profile: loaded }) => (
          <>
            <StreamerHero channels={channels} profile={loaded} />
            {loaded.kind === 'editorial' && <ClaimBanner slug={loaded.slug} />}
            {loaded.live && <LiveBlock channels={channels} live={loaded.live} />}
            {loaded.accountId !== null && <StreamerStats accountId={loaded.accountId} />}
            {loaded.latestVideos.length > 0 && <LatestVideos videos={loaded.latestVideos} />}
          </>
        ))
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            <Skeleton height={280} shape='block' />
            <Skeleton height={140} shape='block' />
          </div>
        ))
        .with({ error: P.when(isNotFoundError) }, () => notFound())
        .otherwise(() => (
          <EmptyState
            action={
              <Button variant='secondary' onClick={() => refetch()}>
                <RotateCw size={15} />
                {t('retry')}
              </Button>
            }
            description={t('errorDescription')}
            title={t('errorTitle')}
          />
        ))}
    </div>
  );
};
