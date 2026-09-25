'use client';

import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { Button, EmptyState, Skeleton } from '@/ui-kit';

import type { StreamerPageProps } from './StreamerPage.types';

import { useStreamerPage } from '../model/hooks';
import { StreamerHero, StreamerStats } from './components';

import s from './StreamerPage.module.scss';

export const StreamerPage = ({ slug }: StreamerPageProps) => {
  const t = useTranslations('streamer.page');
  const { data: profile, isPending, error, refetch } = useStreamerPage(slug);

  return (
    <div className={s.root}>
      {match({ profile, isPending, error })
        .with({ profile: P.nonNullable }, ({ profile: loaded }) => (
          <>
            <StreamerHero profile={loaded} />
            {loaded.accountId !== null && <StreamerStats accountId={loaded.accountId} />}
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
